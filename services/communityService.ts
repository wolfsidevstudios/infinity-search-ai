import { supabase } from './supabaseClient';
import { CommunityPost } from '../types';

export const fetchPosts = async (): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data as CommunityPost[];
};

export const searchPosts = async (query: string): Promise<CommunityPost[]> => {
  // Simple text search on content column
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }
  return data as CommunityPost[];
};

export const createPost = async (
  content: string, 
  hashtags: string[], 
  imageFile?: File, 
  user?: any
): Promise<CommunityPost | null> => {
  try {
    let imageUrl = null;

    // 1. Upload Image if present
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);
        
      imageUrl = data.publicUrl;
    }

    // 2. Insert Post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          hashtags,
          image_url: imageUrl,
          user_id: user?.id,
          author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
          author_avatar: user?.user_metadata?.avatar_url
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as CommunityPost;

  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

export const likePost = async (postId: string, currentCount: number) => {
    // For demo simplicity, just increment. Real app needs a separate likes table to track user-post relationship.
    const { error } = await supabase
        .from('posts')
        .update({ likes_count: currentCount + 1 })
        .eq('id', postId);
        
    if (error) console.error("Error liking post", error);
};
