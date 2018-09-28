const {Router} = require("express");
const router = Router();
const article = require('../models/articles')

//发布文章
router.post('/articles', (req, res) => {
    if(req.session.user) {
        console.log(req.body)
        let {title, content, tags=[] } = req.body
        article.create({
            title,
            content,
            tags,
            author:req.session.user.username,
            authorMsg: req.session.user
        }).then(data => {
            res.json({
                code: 200,
                data,
                msg: '文章发布成功'
            })
        })
    }
    else {
        res.json({
            code: 403,
            msg: '未登录不能发布笔记'
        })
    }
})
//获取文章
router.get('/articles', (req, res) =>{
   
    let {pn=1,size=10} = req.query;
    // authorMsg:req.session.user._id  加上可只显示自己的信息
    article.find({}, function (err, data) {
        res.json({
                    code: 200,
                    data
                })
    });
   
  
})
// 搜索框查询（正则查询）
router.get('/articles/title/:title', (req, res) =>{
 
            console.log(req.params.title)
            let a=new RegExp( `^.*${req.params.title}.*$`)//存在是否存在以传入的title为内容的正则
            // let a=new RegExp(`^${req.params.title}`)
            // authorMsg:req.session.user._id
           article.find({title:a}, function (err, data) {
           if(err){
               res.json({
                   code: 401,
                   msg:'未找到'
               })
           }
           else{
               res.json({
                   code: 200,
                   data
               })
           }
        });
  
 })
 //查询文章内容
router.get('/articles/:id', (req, res) =>{
     article.find({_id:req.params.id}, function (err, data) {
        if(err){
            res.json({
                code: 401,
                msg:'未找到'
            })
        }
        else{
            article.update({_id:req.params.id},{$inc:{looknums:1}},function(err,data2){
            })
            res.json({
                code: 200,
                data
            })
        }
     });
 })
module.exports = router;
