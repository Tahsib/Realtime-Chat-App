var request = require('request')

describe("calc",()=>{
    it('mul 2 and 2', ()=>{
        expect(2*2).toBe(4)
    })
})

describe("get messages", ()=>{
    it('should return 200 ok',(done)=>{
        request.get('http://localhost:3000/messages',(err,res)=>{
            expect(JSON.parse(res.body).length).toBeGreaterThan(2)
            done()
        })
    })
    it('name should be tyler',(done)=>{
        request.get('http://localhost:3000/messages/tyler',(err,res)=>{
            expect(JSON.parse(res.body)[0].name).toEqual('tyler')
            done()
        })
    })

})