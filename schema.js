const {GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull}=require('graphql')
const axios=require('axios')


// const customers=[
//     {
//         id:'1',
//         name:'krishna',
//         email:'kmt@example.com',
//         age:21
//     },
//     {
//         id:'2',
//         name:'mahesh',
//         email:'kmtn@example.com',
//         age:20
//     }
// ]

const CustomerType=new GraphQLObjectType({
    name:'Customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt},
    })
})

// const rootQuery=new GraphQLObjectType({
//     name:'RootQueryType',
//     fields:{
//         customer:{
//             type:CustomerType,
//             args:{
//                 id:{type:GraphQLString}
//             },
//             resolve(parentValue,args){
//                 for(let i=0;i<customers.length;i++){
//                     if(customers[i].id==args.id){
//                         return customers[i];
//                     }
//                 }
//             }
//         },
//         customers:{
//             type:new GraphQLList(CustomerType),
//             resolve(parentValue,args){
//                 return customers;
//             }
//         }
//     }
    
// })



const rootQuery=new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue,args){
                return axios.get("http://localhost:3000/customers/"+args.id).then(res=>res.data)
            }
        },
        customers:{
            type:new GraphQLList(CustomerType),
            resolve(parentValue,args){
                return axios.get("http://localhost:3000/customers/").then(res=>res.data)
            }
        }
    }
    
})


const mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentValue,args){
                return axios.post('http://localhost:3000/customers',{
                    name:args.name,
                    email:args.email,
                    age:args.age
                }).then(res=>res.data)
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue,args){
                return axios.delete('http://localhost:3000/customers/'+args.id).then(res=>res.data)
            }
        },
        updateCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLString},
                age:{type:GraphQLInt},
                name:{type:GraphQLString}
            },
            resolve(parentValue,args){
                return axios.patch('http://localhost:3000/customers/'+args.id,args).then(res=>res.data)
            }
        },
    }
})


module.exports=new GraphQLSchema({
    query:rootQuery,
    mutation
});