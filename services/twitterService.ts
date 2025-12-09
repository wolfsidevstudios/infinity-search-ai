import { MediaItem } from "../types";

const RAPIDAPI_HOST = 'twitter-api45.p.rapidapi.com';
// NOTE: You must add your RapidAPI key here for real data
const API_KEY = 'e961cb2507mshcf8c1a6cfd04874p15b686jsncb498cec734b'; 

export const searchTwitter = async (query: string): Promise<MediaItem[]> => {
  try {
    if (!API_KEY) throw new Error("No API Key");

    const url = `https://${RAPIDAPI_HOST}/search.php?query=${encodeURIComponent(query)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Twitter API request failed");

    const data = await response.json();
    const tweets = data.timeline || [];

    return tweets.map((tweet: any) => ({
      id: tweet.tweet_id,
      type: 'article', // Treat as article for generic rendering fallback, but handled specifically in View
      thumbnailUrl: tweet.media?.[0]?.media_url_https || tweet.author?.avatar_url || '',
      contentUrl: `https://twitter.com/${tweet.author?.screen_name}/status/${tweet.tweet_id}`,
      pageUrl: `https://twitter.com/${tweet.author?.screen_name}/status/${tweet.tweet_id}`,
      title: tweet.text,
      source: 'Twitter',
      data: {
        authorName: tweet.author?.name,
        authorHandle: tweet.author?.screen_name,
        avatar: tweet.author?.avatar_url,
        likes: tweet.favorites,
        retweets: tweet.retweets,
        date: tweet.created_at,
        isTwitter: true
      }
    }));

  } catch (error) {
    console.warn("Twitter API Error (Using Mock Data):", error);
    
    // Mock Data for Demo
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 'mock-1',
        type: 'article',
        thumbnailUrl: '',
        contentUrl: '#',
        pageUrl: '#',
        title: `Just checked out the new updates for ${query}. Absolutely mind-blowing integration! 🚀 #tech #ai`,
        source: 'Twitter',
        data: {
          authorName: 'Alex Dev',
          authorHandle: 'alex_codes',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          likes: 1240,
          retweets: 320,
          date: new Date().toISOString(),
          isTwitter: true
        }
      },
      {
        id: 'mock-2',
        type: 'article',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80',
        contentUrl: '#',
        pageUrl: '#',
        title: `Does anyone else feel like ${query} is going to change the industry forever? The speed is incredible.`,
        source: 'Twitter',
        data: {
          authorName: 'Sarah Tech',
          authorHandle: 'sarah_builds',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          likes: 856,
          retweets: 145,
          date: new Date(Date.now() - 3600000).toISOString(),
          isTwitter: true
        }
      },
      {
        id: 'mock-3',
        type: 'article',
        thumbnailUrl: '',
        contentUrl: '#',
        pageUrl: '#',
        title: `Thread 🧵: Here is everything you need to know about ${query} and why it matters. 1/5`,
        source: 'Twitter',
        data: {
          authorName: 'Market Watcher',
          authorHandle: 'markets_daily',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
          likes: 2400,
          retweets: 890,
          date: new Date(Date.now() - 7200000).toISOString(),
          isTwitter: true
        }
      }
    ];
  }
};