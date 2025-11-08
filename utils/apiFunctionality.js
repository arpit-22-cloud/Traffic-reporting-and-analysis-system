class APIFunctionality {
  constructor(query, queryStr) {
    this.query = query,
    this.queryStr = queryStr;
  }
  search() {
    let queryArr=[]
    if (this.queryStr.keyword) {
      queryArr.push({
        name: {
          $regex: this.queryStr.keyword,
          $options: "i"
        },
      } ,{
        category:{
          $regex:this.queryStr.keyword,
          $options:'i'
        },})}
    // const keyword = this.queryStr.keyword ? {
      //   name: {
      //     $regex: this.queryStr.keyword,
      //     $options: "i"
      //   },
      // } : {};
      // const category=this.queryStr.category?{
      //   category:{
      //     $regex:this.queryStr.category,
      //     $options:'i'
      //   },
      // }:{}
    // this.query = this.query.find({ ...keyword,...category })

    if(queryArr.length > 0 ){
      this.query=this.query.find({$or:queryArr})
    }
    return this
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ['keyword', 'page', 'limit']
    removeFields.forEach((key) => {delete queryCopy[key]})
    let queryStr=JSON.stringify(queryCopy)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match)=>`$${match}`)
    this.query= this.query.find(JSON.parse(queryStr))
    return this
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }
}
export default APIFunctionality;