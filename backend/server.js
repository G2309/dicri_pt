const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/expedientes', require('./src/routes/expedientesRoutes'));
app.use('/api/expedientes', require('./src/routes/indiciosRoutes')); 
app.use('/api/revision', require('./src/routes/revisionRoutes'));
app.use('/api/reportes', require('./src/routes/reportesRoutes'));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
