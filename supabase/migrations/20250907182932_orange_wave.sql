/*
  # Create sample blog data

  1. Sample Data
    - Create sample categories
    - Create sample tags  
    - Create sample posts with content
    - Link posts to categories and tags

  2. Security
    - All tables already have RLS enabled
    - Sample data will be publicly readable for published posts
*/

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Match Reports', 'match-reports', 'Detailed coverage of ASA matches, including analysis and highlights'),
  ('Transfers', 'transfers', 'Latest news on player transfers, signings, and contract updates'),
  ('Training', 'training', 'Behind-the-scenes look at training sessions and preparation'),
  ('Programming', 'programming', 'Programming tutorials and guides'),
  ('Development', 'development', 'Web development and software engineering'),
  ('Design', 'design', 'UI/UX design and visual design principles')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
  ('Championship', 'championship'),
  ('Victory', 'victory'),
  ('Wydad', 'wydad'),
  ('Final', 'final'),
  ('Transfer', 'transfer'),
  ('New Player', 'new-player'),
  ('Midfielder', 'midfielder'),
  ('TypeScript', 'typescript'),
  ('JavaScript', 'javascript'),
  ('Programming', 'programming'),
  ('Web Development', 'web-development'),
  ('Modern', 'modern'),
  ('Apps', 'apps'),
  ('CSS', 'css'),
  ('Layout', 'layout'),
  ('Grid', 'grid')
ON CONFLICT (slug) DO NOTHING;

-- Create a sample profile (this would normally be created when a user signs up)
INSERT INTO profiles (id, user_id, display_name, bio) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Ahmed Benali', 'Sports journalist covering ASA for over 10 years')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample posts
DO $$
DECLARE
  match_reports_id UUID;
  transfers_id UUID;
  training_id UUID;
  programming_id UUID;
  development_id UUID;
  design_id UUID;
  author_id UUID;
  championship_tag_id UUID;
  victory_tag_id UUID;
  wydad_tag_id UUID;
  final_tag_id UUID;
  transfer_tag_id UUID;
  new_player_tag_id UUID;
  midfielder_tag_id UUID;
  typescript_tag_id UUID;
  javascript_tag_id UUID;
  programming_tag_id UUID;
  web_dev_tag_id UUID;
  modern_tag_id UUID;
  apps_tag_id UUID;
  css_tag_id UUID;
  layout_tag_id UUID;
  grid_tag_id UUID;
  post1_id UUID;
  post2_id UUID;
  post3_id UUID;
  post4_id UUID;
  post5_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO match_reports_id FROM categories WHERE slug = 'match-reports';
  SELECT id INTO transfers_id FROM categories WHERE slug = 'transfers';
  SELECT id INTO training_id FROM categories WHERE slug = 'training';
  SELECT id INTO programming_id FROM categories WHERE slug = 'programming';
  SELECT id INTO development_id FROM categories WHERE slug = 'development';
  SELECT id INTO design_id FROM categories WHERE slug = 'design';
  
  -- Get author ID
  SELECT id INTO author_id FROM profiles WHERE display_name = 'Ahmed Benali';
  
  -- Get tag IDs
  SELECT id INTO championship_tag_id FROM tags WHERE slug = 'championship';
  SELECT id INTO victory_tag_id FROM tags WHERE slug = 'victory';
  SELECT id INTO wydad_tag_id FROM tags WHERE slug = 'wydad';
  SELECT id INTO final_tag_id FROM tags WHERE slug = 'final';
  SELECT id INTO transfer_tag_id FROM tags WHERE slug = 'transfer';
  SELECT id INTO new_player_tag_id FROM tags WHERE slug = 'new-player';
  SELECT id INTO midfielder_tag_id FROM tags WHERE slug = 'midfielder';
  SELECT id INTO typescript_tag_id FROM tags WHERE slug = 'typescript';
  SELECT id INTO javascript_tag_id FROM tags WHERE slug = 'javascript';
  SELECT id INTO programming_tag_id FROM tags WHERE slug = 'programming';
  SELECT id INTO web_dev_tag_id FROM tags WHERE slug = 'web-development';
  SELECT id INTO modern_tag_id FROM tags WHERE slug = 'modern';
  SELECT id INTO apps_tag_id FROM tags WHERE slug = 'apps';
  SELECT id INTO css_tag_id FROM tags WHERE slug = 'css';
  SELECT id INTO layout_tag_id FROM tags WHERE slug = 'layout';
  SELECT id INTO grid_tag_id FROM tags WHERE slug = 'grid';

  -- Insert sample posts
  INSERT INTO posts (id, title, slug, excerpt, content, featured_image_url, author_id, category_id, status, published_at, meta_title, meta_description) VALUES
    (
      gen_random_uuid(),
      'ASA Wins Championship Final Against Wydad Casablanca',
      'asa-wins-championship-final-wydad',
      'In a thrilling match that went into extra time, ASA secured their first championship title in over a decade with a spectacular 3-2 victory.',
      '<div class="prose prose-lg max-w-none">
        <p>In a thrilling match that will be remembered for years to come, ASA secured their first championship title in over a decade with a spectacular 3-2 victory against Wydad Casablanca at the Mohammed V Stadium.</p>
        
        <h2>Match Highlights</h2>
        <p>The match started with high intensity from both sides. ASA took an early lead in the 15th minute through a brilliant strike from Youssef Amrani, who curled the ball into the top corner from 25 yards out.</p>
        
        <p>Wydad responded quickly, equalizing just 10 minutes later through their captain Badr Benoun. The first half ended 1-1, setting up what would be an unforgettable second half.</p>
        
        <h2>Second Half Drama</h2>
        <p>The second half saw end-to-end action with both teams creating numerous chances. ASA regained the lead in the 65th minute when striker Ahmed Reda capitalized on a defensive error to slot home from close range.</p>
        
        <p>Just when it seemed ASA had secured the victory, Wydad struck back in the 88th minute through a controversial penalty, sending the match into extra time.</p>
        
        <h2>Extra Time Glory</h2>
        <p>In the 105th minute of extra time, substitute Mehdi Alaoui became the hero, scoring the winning goal with a spectacular overhead kick that sent the ASA fans into delirium.</p>
        
        <p>This victory marks ASA''s return to the top of Moroccan football and validates the hard work put in by coach Rachid Taoussi and his squad throughout the season.</p>
        
        <h2>What This Means</h2>
        <p>This championship win is more than just a trophy – it represents the culmination of years of rebuilding and investment in youth development. The victory also secures ASA''s place in next season''s CAF Champions League.</p>
      </div>',
      'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      author_id,
      match_reports_id,
      'published',
      '2024-01-15T10:00:00Z',
      'ASA Wins Championship Final Against Wydad Casablanca - Historic Victory',
      'ASA secured their first championship title in over a decade with a spectacular 3-2 victory against Wydad Casablanca in extra time.'
    ) RETURNING id INTO post1_id;

  INSERT INTO posts (id, title, slug, excerpt, content, featured_image_url, author_id, category_id, status, published_at, meta_title, meta_description) VALUES
    (
      gen_random_uuid(),
      'New Signing: Youssef Amrani Joins ASA',
      'new-signing-youssef-amrani',
      'The talented midfielder from Raja Casablanca brings experience and skill to strengthen our midfield.',
      '<div class="prose prose-lg max-w-none">
        <p>ASA is delighted to announce the signing of midfielder Youssef Amrani from Raja Casablanca on a three-year deal.</p>
        
        <h2>Player Profile</h2>
        <p>Amrani, 26, brings a wealth of experience having made over 100 appearances for Raja Casablanca and earned 15 caps for the Moroccan national team.</p>
        
        <p>Known for his technical ability, vision, and leadership qualities, Amrani will add significant depth to ASA''s midfield options for the upcoming season.</p>
        
        <h2>Manager''s Comments</h2>
        <p>"Youssef is exactly the type of player we''ve been looking for," said head coach Rachid Taoussi. "His experience at the highest level and his understanding of Moroccan football will be invaluable to our squad."</p>
        
        <p>"I''m excited to work with him and I''m confident he''ll make an immediate impact on our team''s performance."</p>
        
        <h2>Player''s Statement</h2>
        <p>"I''m thrilled to join ASA," said Amrani. "This is a club with great ambition and I''m looking forward to contributing to the team''s success."</p>
        
        <p>"The project here is very exciting and I can''t wait to get started and meet my new teammates."</p>
      </div>',
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
      author_id,
      transfers_id,
      'published',
      '2024-01-14T15:30:00Z',
      'New Signing: Youssef Amrani Joins ASA',
      'The talented midfielder from Raja Casablanca brings experience and skill to strengthen our midfield.'
    ) RETURNING id INTO post2_id;

  INSERT INTO posts (id, title, slug, excerpt, content, featured_image_url, author_id, category_id, status, published_at, meta_title, meta_description) VALUES
    (
      gen_random_uuid(),
      'Advanced TypeScript Techniques',
      'advanced-typescript-techniques',
      'Learn advanced TypeScript patterns and techniques to write better, more maintainable code.',
      '<div class="prose prose-lg max-w-none">
        <p>TypeScript has revolutionized the way we write JavaScript, providing type safety and better developer experience. In this comprehensive guide, we''ll explore advanced TypeScript techniques that will take your coding skills to the next level.</p>
        
        <h2>Generic Types and Constraints</h2>
        <p>Generics are one of TypeScript''s most powerful features, allowing you to write reusable code that works with multiple types while maintaining type safety.</p>
        
        <h2>Conditional Types</h2>
        <p>Conditional types enable you to create types that depend on a condition, making your type definitions more flexible and expressive.</p>
        
        <h2>Mapped Types</h2>
        <p>Mapped types allow you to create new types by transforming properties of existing types, providing powerful ways to manipulate type definitions.</p>
        
        <h2>Template Literal Types</h2>
        <p>Template literal types combine the power of template literals with TypeScript''s type system, enabling sophisticated string manipulation at the type level.</p>
        
        <h2>Utility Types</h2>
        <p>TypeScript provides many built-in utility types that help you transform and manipulate types in common ways, making your code more concise and readable.</p>
      </div>',
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
      author_id,
      programming_id,
      'published',
      '2024-01-13T10:00:00Z',
      'Advanced TypeScript Techniques - Complete Guide',
      'Learn advanced TypeScript patterns and techniques to write better, more maintainable code.'
    ) RETURNING id INTO post3_id;

  INSERT INTO posts (id, title, slug, excerpt, content, featured_image_url, author_id, category_id, status, published_at, meta_title, meta_description) VALUES
    (
      gen_random_uuid(),
      'Building Modern Web Apps',
      'building-modern-web-apps',
      'A comprehensive guide to building modern web applications with the latest technologies and best practices.',
      '<div class="prose prose-lg max-w-none">
        <p>Modern web development has evolved significantly over the past few years. Today''s web applications are more sophisticated, performant, and user-friendly than ever before.</p>
        
        <h2>The Modern Web Stack</h2>
        <p>Today''s web applications typically use a combination of modern frameworks, build tools, and deployment strategies to deliver exceptional user experiences.</p>
        
        <h2>Frontend Frameworks</h2>
        <p>React, Vue, and Angular continue to dominate the frontend landscape, each offering unique advantages for different types of applications.</p>
        
        <h2>State Management</h2>
        <p>Managing application state effectively is crucial for building scalable web applications. Modern solutions include Redux, Zustand, and built-in framework state management.</p>
        
        <h2>Performance Optimization</h2>
        <p>Performance is key to user satisfaction. Learn about code splitting, lazy loading, and other optimization techniques.</p>
        
        <h2>Deployment and DevOps</h2>
        <p>Modern deployment strategies using CI/CD pipelines, containerization, and cloud platforms ensure reliable and scalable applications.</p>
      </div>',
      'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
      author_id,
      development_id,
      'published',
      '2024-01-14T09:00:00Z',
      'Building Modern Web Apps - Complete Guide',
      'A comprehensive guide to building modern web applications with the latest technologies and best practices.'
    ) RETURNING id INTO post4_id;

  INSERT INTO posts (id, title, slug, excerpt, content, featured_image_url, author_id, category_id, status, scheduled_at, meta_title, meta_description) VALUES
    (
      gen_random_uuid(),
      'CSS Grid Layout Guide',
      'css-grid-layout-guide',
      'Master CSS Grid Layout with this comprehensive guide covering all the essential concepts and practical examples.',
      '<div class="prose prose-lg max-w-none">
        <p>CSS Grid Layout is a powerful two-dimensional layout system that has revolutionized how we create web layouts. This guide will take you from beginner to advanced Grid techniques.</p>
        
        <h2>Grid Basics</h2>
        <p>Understanding the fundamental concepts of CSS Grid, including grid containers, grid items, and the grid coordinate system.</p>
        
        <h2>Grid Template Areas</h2>
        <p>Learn how to create complex layouts using named grid areas, making your CSS more readable and maintainable.</p>
        
        <h2>Responsive Grid Layouts</h2>
        <p>Discover how to create responsive layouts that adapt to different screen sizes using Grid''s powerful features.</p>
        
        <h2>Grid vs Flexbox</h2>
        <p>Understand when to use Grid versus Flexbox, and how they can work together to create sophisticated layouts.</p>
        
        <h2>Advanced Grid Techniques</h2>
        <p>Explore advanced Grid features like subgrid, implicit grids, and complex alignment options.</p>
      </div>',
      'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg',
      author_id,
      design_id,
      'scheduled',
      '2024-01-20T10:00:00Z',
      'CSS Grid Layout Guide - Master Modern CSS Layouts',
      'Master CSS Grid Layout with this comprehensive guide covering all the essential concepts and practical examples.'
    ) RETURNING id INTO post5_id;

  -- Link posts to tags
  -- Post 1 tags (Championship post)
  INSERT INTO post_tags (post_id, tag_id) VALUES
    (post1_id, championship_tag_id),
    (post1_id, victory_tag_id),
    (post1_id, wydad_tag_id),
    (post1_id, final_tag_id);

  -- Post 2 tags (Transfer post)
  INSERT INTO post_tags (post_id, tag_id) VALUES
    (post2_id, transfer_tag_id),
    (post2_id, new_player_tag_id),
    (post2_id, midfielder_tag_id);

  -- Post 3 tags (TypeScript post)
  INSERT INTO post_tags (post_id, tag_id) VALUES
    (post3_id, typescript_tag_id),
    (post3_id, javascript_tag_id),
    (post3_id, programming_tag_id);

  -- Post 4 tags (Web Development post)
  INSERT INTO post_tags (post_id, tag_id) VALUES
    (post4_id, web_dev_tag_id),
    (post4_id, modern_tag_id),
    (post4_id, apps_tag_id);

  -- Post 5 tags (CSS Grid post)
  INSERT INTO post_tags (post_id, tag_id) VALUES
    (post5_id, css_tag_id),
    (post5_id, layout_tag_id),
    (post5_id, grid_tag_id);

END $$;