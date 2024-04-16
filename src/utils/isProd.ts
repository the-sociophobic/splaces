const isProd = () => {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV !== 'development'
  // !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
}


export default isProd
