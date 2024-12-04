import {findPeriodCtrList,searchUserDataList} from '@/api/dataManage.js'
 
 

export default{
    namespaced:true,
    state:{
        perioadCtrList:[],
        userDataList:[],
        goreset:0,
        goresetData:0,
        
    },
    mutations:{
        set_perioadCtrList(state,val){
            state.perioadCtrList = val
        },
        set_userDataList(state,val){
            state.userDataList = val
        },
        set_goreset(state){
            
                console.log(1);
                
                
                console.log('一直调用？');
                state.goreset = state.goreset === 0 ? 1 : 0;
               
              
        },
        set_goresetData(state){
            state.goresetData = state.goresetData==0?1:0
        }
    },
    actions:{
        // 查找评分周期
        getPerioadCtrListAction({commit},val){
            return new Promise((resolve,reject)=>{
                findPeriodCtrList(val).then(res=>{
                    console.log(res);
                    if(res.code==0){
                        commit('set_perioadCtrList',res.data.rows)
                        resolve(res.data)
                    }else{
                        reject(res.mag)
                    }
                })
            })
        },
        // 查找表格数据
        searchUserDataListAction({commit},val){
            return new Promise((resolve,reject)=>{
                searchUserDataList(val).then(res=>{
                    console.log('res');
                    
                    if(res.code==0 && res.data.total){
                        commit('set_userDataList',res.data.rows)
                        commit('set_goreset')
                        resolve(res.data)
                    }else if(res.code==0 && !res.data.total){
                        commit('set_userDataList',[])
                        commit('set_goreset')
                        resolve(res.data)
                    }else{
                        reject(res.msg)
                    }
                })
            })
        }
    },
    getters: {
        getPerioadCtrList(state) {
          return state.perioadCtrList
        },
        getUserDataList(state){
            return state.userDataList
        }
    }
}