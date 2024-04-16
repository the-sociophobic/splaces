const isProd = () =>
  process.env.NODE_ENV !== 'development'


export default isProd
