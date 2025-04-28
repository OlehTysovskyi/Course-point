module.exports = (err, req, res, next) => {
    console.error(err.stack);                // лог помилки
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};
