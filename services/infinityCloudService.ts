
import { supabase } from './supabaseClient';
import { CollectionItem, HistoryItem } from '../types';

export const enableInfinityCloud = async (userId: string) => {
    // Upsert settings to enable cloud
    const { error } = await supabase.from('user_settings').upsert({ 
        user_id: userId, 
        is_cloud_enabled: true,
        updated_at: new Date() 
    });
    
    if (error) throw error;
    localStorage.setItem('infinity_cloud_enabled', 'true');
};

export const disableInfinityCloud = async (userId: string) => {
    await supabase.from('user_settings').upsert({ 
        user_id: userId, 
        is_cloud_enabled: false,
        updated_at: new Date() 
    });
    localStorage.removeItem('infinity_cloud_enabled');
};

export const syncData = async (
    userId: string, 
    collections: CollectionItem[], 
    history: HistoryItem[], 
    settings: { weatherUnit: string; wallpaperUrl: string | null; osVersion: string }
) => {
    if (!userId) return;

    try {
        // 1. Sync Settings
        await supabase.from('user_settings').upsert({
            user_id: userId,
            weather_unit: settings.weatherUnit,
            wallpaper_url: settings.wallpaperUrl,
            os_version: settings.osVersion,
            is_cloud_enabled: true,
            updated_at: new Date()
        });

        // 2. Sync Collections (Upsert Batch)
        if (collections.length > 0) {
            const colPayload = collections.map(c => ({
                id: c.id,
                user_id: userId,
                type: c.type,
                content: c.content,
                created_at: new Date(c.dateAdded)
            }));
            await supabase.from('collections').upsert(colPayload);
        }

        // 3. Sync History (Upsert Batch - Recent 50)
        if (history.length > 0) {
            const histPayload = history.slice(0, 50).map(h => ({
                id: h.id,
                user_id: userId,
                type: h.type,
                title: h.title,
                summary: h.summary,
                sources: h.sources,
                data: h.data,
                created_at: h.timestamp
            }));
            await supabase.from('search_history').upsert(histPayload);
        }

        return { success: true, timestamp: new Date() };
    } catch (error) {
        console.error("Cloud Sync Error:", error);
        return { success: false, error };
    }
};

export const loadFromCloud = async (userId: string) => {
    try {
        // Parallel Fetch
        const [settingsRes, colRes, histRes] = await Promise.all([
            supabase.from('user_settings').select('*').eq('user_id', userId).single(),
            supabase.from('collections').select('*').eq('user_id', userId),
            supabase.from('search_history').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        ]);

        if (settingsRes.error && settingsRes.error.code !== 'PGRST116') {
             console.error("Error loading settings", settingsRes.error);
        }

        return {
            settings: settingsRes.data,
            collections: colRes.data?.map((c: any) => ({
                id: c.id,
                type: c.type,
                content: c.content,
                dateAdded: new Date(c.created_at).getTime()
            })) as CollectionItem[] || [],
            history: histRes.data?.map((h: any) => ({
                id: h.id,
                type: h.type,
                title: h.title,
                summary: h.summary,
                sources: h.sources,
                data: h.data,
                timestamp: new Date(h.created_at)
            })) as HistoryItem[] || []
        };
    } catch (error) {
        console.error("Load from Cloud Error:", error);
        return null;
    }
};
