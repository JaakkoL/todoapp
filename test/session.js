var assert = require("assert"),
    http   = require('request'),
    should  = require('should');

describe('Get test post',function(){
  it('should be successful.', function(done){
    http.get(url + '/posts/' + test.postId, function (err,res,body) {
      if(err) { done(err) }
      else {
        res.statusCode.should.be.equal(200)
        should.exist(body)
        var obj = JSON.parse(body)
        obj.should.be.a('object')
        obj.should.have.property('id',test.postId)
        obj.should.have.property('title','my title')
        obj.should.have.property('tags')
        obj.tags.should.be.a('object')
        obj.tags.should.have.length(3)
        obj.tags.sort().should.be.equal(['atag','btag','ctag'])
        done()
      }
    })
  })
})
