const postModel = require("../models/postModel");
const db = require("../config/db");

exports.createPost = async (req, res) => {
  if (!req.user || !req.user.user_id) {
    return res.status(401).json({ message: "Unauthorized: Invalid user" });
  }

  const { title, content, category_name, destination } = req.body;
  const files = req.files; // Assuming `req.files` is an array of uploaded files

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  if (files.length > 5) {
    return res.status(400).json({ message: "Maximum of 5 images allowed" });
  }

  const image_urls = files.map(file => `/uploads/${file.filename}`);

  try {
    // Fetch category ID in a single query
    const [category] = await db
      .promise()
      .query("SELECT category_id FROM categories WHERE name = ?", [
        category_name,
      ]);

    if (category.length === 0) {
      return res.status(400).json({ message: "Category not found" });
    }

    const category_id = category[0].category_id;

    // Create the post with the fetched category_id and destination
    const postId = await postModel.createPost(
      req.user.user_id,
      title,
      content,
      category_id,
      image_urls.join(','), // Store image URLs as a comma-separated string
      destination
    );

    res.status(201).json({
      message: "Post created successfully",
      post: {
        post_id: postId,
        user_id: req.user.user_id,
        title,
        content,
        category_id,
        image_urls,
        destination,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.promise().query(`
      SELECT 
        p.post_id, 
        p.title, 
        p.content, 
        p.image_url, 
        p.destination, 
        c.name AS category_name, 
        u.username AS author, 
        u.profile_photo AS author_image,
        COUNT(l.like_id) AS likeCount  -- Count the number of likes for each post
      FROM posts p
      JOIN categories c ON p.category_id = c.category_id
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN likes l ON p.post_id = l.post_id  -- Left join to include likes
      GROUP BY p.post_id, u.username, c.name  -- Group by necessary fields
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post details including the author's profile photo and like count
    const [postResult] = await db.promise().query(
      `
        SELECT 
          p.post_id, 
          p.title, 
          p.content, 
          p.image_url, 
          c.name AS category_name, 
          u.username AS author, 
          u.profile_photo AS author_image,  -- Include author's profile photo
          p.created_at, 
          p.likes, 
          p.views,
          COUNT(l.like_id) AS likeCount  -- Count the number of likes for the post
        FROM posts p
        JOIN categories c ON p.category_id = c.category_id
        JOIN users u ON p.user_id = u.user_id
        LEFT JOIN likes l ON p.post_id = l.post_id  -- Left join to include likes
        WHERE p.post_id = ?
        GROUP BY p.post_id, u.username, c.name  -- Group by necessary fields
      `,
      [postId]
    );

    if (postResult.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postResult[0];

    // Fetch comments for the post
    const [commentsResult] = await db.promise().query(
      `
        SELECT 
          comment_id, 
          content, 
          username AS author
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        WHERE post_id = ?
        ORDER BY comments.created_at ASC;
      `,
      [postId]
    );

    res.status(200).json({
      ...post,
      comments: commentsResult,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// server/controllers/postController.js
exports.getLatestPosts = async (req, res) => {
  try {
    // Query the database for the latest 10 posts
    const [posts] = await db.promise().query(`
      SELECT 
        p.post_id, 
        p.title, 
        p.content, 
        p.image_url, 
        p.destination, 
        p.created_at,
        c.name AS category_name, 
        u.username AS author,
        u.profile_photo AS author_image  -- Include author's profile photo
      FROM posts p
      JOIN categories c ON p.category_id = c.category_id
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    // Check if posts are found
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Send posts as JSON response
    res.status(200).json(posts);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching latest posts:", error);
    // Return a server error response
    res.status(500).json({
      message: "Error fetching latest posts",
      error: error.message,
    });
  }
};

exports.updatePost = (req, res) => {
  const postId = req.params.id;

  // Create an object to hold the updates
  const updates = {
      title: req.body.title,
      content: req.body.content,
      category_name: req.body.category_name, // Assuming you want to update the category name
      image_urls: req.files ? req.files.map(file => file.path) : undefined, // Get image URLs from uploaded files
      destination: req.body.destination
  };

  // Remove undefined properties
  Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

  postModel.updatePost(postId, updates)
      .then(results => {
          res.json(results);
      })
      .catch(err => {
          res.status(500).json(err);
      });
};
exports.deletePost = (req, res) => {
  const postId = req.params.id;

  postModel.deletePost(postId)
      .then(results => {
          res.json({ message: 'Post deleted successfully', affectedRows: results.affectedRows });
      })
      .catch(err => {
          if (err.message === 'Post not found') {
              return res.status(404).json({ error: 'Post not found' });
          }
          return res.status(500).json({ error: 'Database error', details: err });
      });
};

exports.getPostsByDestination = async (req, res) => {
  try {
    const destinationName = req.params.destination;
    
    if (!destinationName) {
      return res.status(400).json({ message: "Destination name is required." });
    }
    
    const posts = await postModel.getPostsByDestination(destinationName);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by destination:', error);
    res.status(500).json({ 
      message: 'Error fetching posts by destination', 
      error 
    });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const posts = await postModel.getPostsByCategory(categoryName);
    res.json(posts);
  }
  catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({
      message: 'Error fetching posts by category',
      error: error.message,
    }); 
  }
};

