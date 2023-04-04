const router = express.Router();

// Register API
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;

    // Insert user into database
    pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, results) => {
        if (err) throw err;

        res.json({
          message: 'User registered successfully!'
        });
      }
    );
  });
});

// Login API
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user in database
  pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        res.status(401).json({
          message: 'Invalid email or password'
        });
      } else {
        const user = results[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;

          if (result === true) {
            // Generate JWT token
            const token = jwt.sign(
              { id: user.id, email: user.email },
              secretKey,
              { expiresIn: '1h' }
            );

            res.json({
              message: 'Logged in successfully!',
              token: token
            });
          } else {
            res.status(401).json({
              message: 'Invalid email or password'
            });
          }
        });
      }
    }
  );
});
