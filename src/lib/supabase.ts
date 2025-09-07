import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type Category = Database['public']['Tables']['categories']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to calculate reading time
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Posts functions
export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name, bio, avatar_url),
      categories (name, slug),
      post_tags (
        tags (name, slug)
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data?.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    featuredImageUrl: post.featured_image_url || "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    author: {
      name: post.profiles?.display_name || 'Unknown Author',
      bio: post.profiles?.bio || '',
      avatar: post.profiles?.avatar_url
    },
    category: {
      name: post.categories?.name || 'Uncategorized',
      slug: post.categories?.slug || 'uncategorized'
    },
    tags: post.post_tags?.map(pt => ({
      name: pt.tags?.name || '',
      slug: pt.tags?.slug || ''
    })) || [],
    status: post.status,
    publishedAt: post.published_at || post.created_at,
    scheduledAt: post.scheduled_at,
    updatedAt: post.updated_at,
    views: 0, // Would need separate analytics table
    commentsCount: 0, // Would need to count comments
    readingTime: calculateReadingTime(post.content),
    metaTitle: post.meta_title,
    metaDescription: post.meta_description
  })) || [];
};

export const getPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name, bio, avatar_url),
      categories (name, slug),
      post_tags (
        tags (name, slug)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: data.content,
    featuredImageUrl: data.featured_image_url || "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    author: {
      name: data.profiles?.display_name || 'Unknown Author',
      bio: data.profiles?.bio || '',
      avatar: data.profiles?.avatar_url
    },
    category: {
      name: data.categories?.name || 'Uncategorized',
      slug: data.categories?.slug || 'uncategorized'
    },
    tags: data.post_tags?.map(pt => ({
      name: pt.tags?.name || '',
      slug: pt.tags?.slug || ''
    })) || [],
    status: data.status,
    publishedAt: data.published_at || data.created_at,
    scheduledAt: data.scheduled_at,
    updatedAt: data.updated_at,
    views: 0,
    commentsCount: 0,
    readingTime: calculateReadingTime(data.content),
    metaTitle: data.meta_title,
    metaDescription: data.meta_description
  };
};

export const getPostsByCategory = async (categorySlug: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name, bio, avatar_url),
      categories!inner (name, slug),
      post_tags (
        tags (name, slug)
      )
    `)
    .eq('categories.slug', categorySlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return data?.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    featuredImageUrl: post.featured_image_url || "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    author: {
      name: post.profiles?.display_name || 'Unknown Author',
      bio: post.profiles?.bio || '',
      avatar: post.profiles?.avatar_url
    },
    category: {
      name: post.categories?.name || 'Uncategorized',
      slug: post.categories?.slug || 'uncategorized'
    },
    tags: post.post_tags?.map(pt => ({
      name: pt.tags?.name || '',
      slug: pt.tags?.slug || ''
    })) || [],
    status: post.status,
    publishedAt: post.published_at || post.created_at,
    scheduledAt: post.scheduled_at,
    updatedAt: post.updated_at,
    views: 0,
    commentsCount: 0,
    readingTime: calculateReadingTime(post.content),
    metaTitle: post.meta_title,
    metaDescription: post.meta_description
  })) || [];
};

export const getFeaturedPost = async () => {
  const posts = await getAllPosts();
  return posts.length > 0 ? posts[0] : null;
};

export const getRecentPosts = async (limit: number = 4) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name, bio, avatar_url),
      categories (name, slug),
      post_tags (
        tags (name, slug)
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return data?.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    featuredImageUrl: post.featured_image_url || "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
    author: {
      name: post.profiles?.display_name || 'Unknown Author',
      bio: post.profiles?.bio || '',
      avatar: post.profiles?.avatar_url
    },
    category: {
      name: post.categories?.name || 'Uncategorized',
      slug: post.categories?.slug || 'uncategorized'
    },
    tags: post.post_tags?.map(pt => ({
      name: pt.tags?.name || '',
      slug: pt.tags?.slug || ''
    })) || [],
    status: post.status,
    publishedAt: post.published_at || post.created_at,
    scheduledAt: post.scheduled_at,
    updatedAt: post.updated_at,
    views: 0,
    commentsCount: 0,
    readingTime: calculateReadingTime(post.content),
    metaTitle: post.meta_title,
    metaDescription: post.meta_description
  })) || [];
};

// Admin functions
export const getAdminPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name),
      categories (name, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin posts:', error);
    return [];
  }

  return data?.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    author: post.profiles?.display_name || 'Unknown Author',
    status: post.status,
    category: post.categories?.name || 'Uncategorized',
    tags: [], // Would need to fetch separately
    publishDate: post.published_at ? post.published_at.split('T')[0] : null,
    views: 0,
    comments: 0
  })) || [];
};

export const getAdminPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (display_name, bio, avatar_url),
      categories (name, slug),
      post_tags (
        tags (name, slug)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: data.content,
    featuredImageUrl: data.featured_image_url,
    author: {
      name: data.profiles?.display_name || 'Unknown Author',
      bio: data.profiles?.bio || '',
      avatar: data.profiles?.avatar_url
    },
    category: {
      name: data.categories?.name || 'Uncategorized',
      slug: data.categories?.slug || 'uncategorized'
    },
    tags: data.post_tags?.map(pt => ({
      name: pt.tags?.name || '',
      slug: pt.tags?.slug || ''
    })) || [],
    status: data.status,
    publishedAt: data.published_at,
    scheduledAt: data.scheduled_at,
    updatedAt: data.updated_at,
    readingTime: calculateReadingTime(data.content),
    metaTitle: data.meta_title,
    metaDescription: data.meta_description
  };
};

export const createPost = async (postData: any) => {
  // First, ensure we have a user profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get or create user profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name: user.email?.split('@')[0] || 'Anonymous'
      })
      .select('id')
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }
    profile = newProfile;
  }

  // Get or create category
  let categoryId = null;
  if (postData.category) {
    let { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', postData.category)
      .single();

    if (!category) {
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: postData.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          slug: postData.category,
          description: `Posts about ${postData.category}`
        })
        .select('id')
        .single();

      if (categoryError) {
        console.error('Error creating category:', categoryError);
      } else {
        category = newCategory;
      }
    }
    categoryId = category?.id;
  }

  // Create the post
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      title: postData.title,
      slug: postData.slug || generateSlug(postData.title),
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image_url: postData.featuredImage,
      author_id: profile.id,
      category_id: categoryId,
      status: postData.status || 'draft',
      scheduled_at: postData.scheduledAt || null,
      published_at: postData.status === 'published' ? new Date().toISOString() : null,
      meta_title: postData.metaTitle,
      meta_description: postData.metaDescription,
      meta_keywords: postData.metaKeywords || []
    })
    .select()
    .single();

  if (postError) {
    console.error('Error creating post:', postError);
    throw postError;
  }

  // Handle tags
  if (postData.tags && postData.tags.length > 0) {
    for (const tagName of postData.tags) {
      // Get or create tag
      let { data: tag } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', generateSlug(tagName))
        .single();

      if (!tag) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({
            name: tagName,
            slug: generateSlug(tagName)
          })
          .select('id')
          .single();
        tag = newTag;
      }

      if (tag) {
        await supabase
          .from('post_tags')
          .insert({
            post_id: newPost.id,
            tag_id: tag.id
          });
      }
    }
  }

  return newPost;
};

export const updatePost = async (id: string, postData: any) => {
  // Get or create category if changed
  let categoryId = null;
  if (postData.category) {
    let { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', postData.category)
      .single();

    if (!category) {
      const { data: newCategory } = await supabase
        .from('categories')
        .insert({
          name: postData.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          slug: postData.category,
          description: `Posts about ${postData.category}`
        })
        .select('id')
        .single();
      category = newCategory;
    }
    categoryId = category?.id;
  }

  const { data, error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image_url: postData.featuredImage,
      category_id: categoryId,
      status: postData.status,
      scheduled_at: postData.scheduledAt || null,
      published_at: postData.status === 'published' ? 
        (postData.publishedAt || new Date().toISOString()) : null,
      meta_title: postData.metaTitle,
      meta_description: postData.metaDescription,
      meta_keywords: postData.metaKeywords || []
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }

  // Update tags
  if (postData.tags) {
    // Remove existing tags
    await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id);

    // Add new tags
    for (const tagName of postData.tags) {
      let { data: tag } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', generateSlug(tagName))
        .single();

      if (!tag) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({
            name: tagName,
            slug: generateSlug(tagName)
          })
          .select('id')
          .single();
        tag = newTag;
      }

      if (tag) {
        await supabase
          .from('post_tags')
          .insert({
            post_id: id,
            tag_id: tag.id
          });
      }
    }
  }

  return data;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }

  return true;
};

// Categories functions
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data?.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    postsCount: 0, // Would need to count posts
    color: "#2563eb", // Default color
    isActive: true,
    createdAt: cat.created_at,
    updatedAt: cat.created_at
  })) || [];
};

export const getCategoryBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
};

// Comments functions
export const getCommentsByPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
};

export const createComment = async (commentData: {
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: commentData.postId,
      author_name: commentData.authorName,
      author_email: commentData.authorEmail,
      content: commentData.content,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  return data;
};