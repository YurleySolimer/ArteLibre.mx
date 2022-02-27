const handleError = (err, others, res) => {
  console.warn("err: ", JSON.stringify(err));
  if (err.errorDetail) {
    console.error("errorDetail: ", JSON.stringify(err.errorDetail));
  }

  const { message, status } = err;

  if (res) {
    return res.status(status || 500).render('500.hbs', { message })  
  }

  return  {
    status: status,
    response: { message },
  };
};

module.exports = handleError;
