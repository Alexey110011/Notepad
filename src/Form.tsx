import {useState, useRef, useEffect} from 'react'
import  {v4} from 'uuid'

type NoteType = {
    onHandleSubmit:(f:any|null)=>any|null;
    onHandleEdit:(f?:any|null)=>typeof f;
    changePost:(f?:any|null)=>typeof f;
    handleClear:(f?:any|never)=>typeof f;
    editedItem:ItemType[]|undefined 
}

type ItemType = {
    post:string,
    tag:string|null,
    id:string;
    search?:string;
    onRemove?:()=>void;
    onEdit?:()=>void
}

type PostListType = {
    items:ItemType[];
    search:string;
    onRemove:(id:string)=>void;
    onEdit:(id:string)=>void
}
type TagListType = {
    items:ItemType[];
    onEdit:(id:string)=>void;
    handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

const Note =({onHandleSubmit, onHandleEdit,changePost,handleClear, editedItem}:NoteType)=> {
    const noteRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    let _note
    if(editedItem&&editedItem.length!==0){
        noteRef.current.value =  editedItem[0].post
    }
    const submit = (e:React.FormEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    _note = noteRef.current.value
    if(editedItem&&editedItem.length===0){
        onHandleSubmit(_note)
    }
    else if(editedItem&&editedItem.length!==0){
        changePost(_note)
        onHandleEdit()
    }
    handleClear() 
    noteRef.current.value=''
    }
    return(
        <form className = "sometext">
            <textarea className="placeholder" ref = {noteRef} placeholder = "Enter text"></textarea>
            <button className = "save" onClick = {submit}>Save</button> 
        </form>
    )
}

const Post =({post, search, onRemove, onEdit}:ItemType)=> {
    if(!search) {
        return(
        <div className = "post">
            {post}
            <button className = "buttonRemove" onClick = {onRemove}>Remove</button>
            <button className = "buttonEdit" onClick = {onEdit}>Edit</button>
        </div>
        )
    } 
    const regex = new RegExp(`(${search})`,'gi')
    const parts = post.split(regex)

    if(regex.test(post)){
        console.log(parts)
        return(
        <div className = "post">
        <span>
            {parts.map((part,i)=>{
            return regex.test(part)?(
            <mark style={{marginLeft:"-2px"}} key = {i}>{part}</mark>)
            :(
                <span key = {i}>{part} </span>
            );
            })}
            <button className = "buttonRemove" onClick = {onRemove}>Remove</button>
            <button className="buttonEdit" onClick = {onEdit}>Edit</button>
        </span>
        </div>
        )} else {return null}
    }

const PostList =({items,search,onRemove,onEdit}:PostListType)=>{
    if(items){
    return (
        <div>
            {items.map(item=> 
                <Post key = {item.id} {...item}
                onRemove = {()=>onRemove(item.id)}
                onEdit = {() =>onEdit(item.id)}
                search={search}/>
            )}
        </div>
    )} else {return null}
   }


const Tag = ({tag, onEdit}:ItemType)=> {
    if(tag){
    return(
         <div className = "tag" onClick={onEdit}>
             {tag}
        </div>)}
        else {return null}
}

const TagList =({items, onEdit, handleChange}:TagListType)=>{
    if(items){
    return (
        <div className='tagInput'>
           <input type= "search" placeholder = "Search by tag" onChange={handleChange}></input>
           <div className = "taglist">Tag List</div>
           {items.map(item=> 
              <Tag key = {item.id} {...item} 
                   onEdit ={()=>onEdit(item.id)} />
           )}
        </div>
    )} else {return null}
}
       
export const Form = ()=> {
    const [items, setItems] = useState<ItemType[]>([])
    const [editedItem,setEditedItem] =useState<ItemType[]|undefined>([])
    const [search, setSearch] = useState<string>('')
    
 useEffect(()=> {
    async function callBackendAPI1(){
        const response = await fetch('/t')
        const body = await response.json()
        if (response.status !== 200) {
          throw Error(body.message) 
        }console.log(body)
        return body;
        };
        callBackendAPI1()
        .then(res=>
        setItems(res))},
        [])


  async function callBackendAPI(){
    const response = await fetch('/t', {
      method: "POST",
        body:JSON.stringify({
         items:items}
        ),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
    }})
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.message) 
    }console.log(body)
    return body;
}

    function handleSubmit(post:string){
        const pattern = /(#[a-zа-я\d-]+)/gi
        const tag = post.match(pattern)
        console.log(tag)
        if(pattern.test(post)){
            const items1 = [...items,
            {post,
            tag:tag?tag[0]:null, 
            id:v4()}]
            setItems(items1)
         }else{
            const items1 = [...items,
            {post,
            tag:null,
            id:v4()}]
            setItems(items1)
          }
          callBackendAPI()
        }

    function handleRemove(id:string) {
        const items1 = items.filter(item=>item.id!==id)
        setItems(items1)
    }

    function handleEdit(id:String) {
        const editedItem_1 = items.filter(item=>
        item.id===id)
        setEditedItem(editedItem_1)
        console.log(editedItem_1)
    }

    function handleEdit1() {
        const items1 = items.map(item=>{
            if(editedItem&&item.id===editedItem[0].id){
            return editedItem[0] 
            } else {
            return item}
        })
        console.log(items1)
        setItems(items1)
    }

    function changePost(post:string) {
        const pattern = /(#[a-zа-я\d-]+)/gi
        const tag = post.match(pattern) 
        function obj3(objec:ItemType[]|undefined,post:string){
            if(objec&&objec.length!==0){
                console.log(objec)
                objec.splice(0,1,{
                post:post,
                id:objec[0].id,
                tag:tag?tag[0]:null
            });
                return objec
            }
        }

    const editedItem1 = obj3(editedItem, post)
    setEditedItem(editedItem1)
    console.log(editedItem1)
    }
   
    function handleClear(){
        const editedItem:ItemType[] = []
        setEditedItem(editedItem)
    }
        
    function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    let search_1 = e.target.value
    setSearch(search_1)
    console.log(search_1)
    }

   
        return(
            <div className = "container">
             <Note onHandleSubmit = {handleSubmit} onHandleEdit = {handleEdit1} changePost = {changePost} handleClear = {handleClear} editedItem = {editedItem}/>
            <PostList items= {items} onRemove = {handleRemove} onEdit = {handleEdit} search={search}/>
            <TagList items = {items} onEdit = {handleEdit} handleChange = {handleChange}/>
            </div>
    )
}