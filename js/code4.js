const decElement = document.querySelector(".dec")
const binElement = document.querySelector(".bin")
const octElement = document.querySelector(".oct")
const hexElement = document.querySelector(".hex")

function decAction(){
    const text=decElement.value
    if(text ==""){
        binElement.value=""
        octElement.value=""
        hexElement.value=""
    }else{
        const decValue=parseInt(text,10)
        binElement.value=decValue.toString(2)
        octElement.value=decValue.toString(8)
        hexElement.value=decValue.toString(16) 
    }
    
}

function binAction(){
    const text=binElement.value
    if(text ==""){
        decElement.value=""
        octElement.value=""
        hexElement.value=""
    }else{
        const binValue=parseInt(text,2)
        decElement.value=binValue.toString(10)
        octElement.value=binValue.toString(8)
        hexElement.value=binValue.toString(16) 
    }
    
}
function octAction(){
    const text=octElement.value
    if(text ==""){
        decElement.value=""
        binElement.value=""
        hexElement.value=""
    }else{
        const octValue=parseInt(text,8)
        decElement.value=octValue.toString(10)
        binElement.value=octValue.toString(2)
        hexElement.value=octValue.toString(16) 
    }
    
}
function hexAction(){
    const text=hexElement.value
    if(text ==""){
        decElement.value=""
        binElement.value=""
        octElement.value=""
    }else{
        const hexValue=parseInt(text,16)
        decElement.value=hexValue.toString(10)
        binElement.value=hexValue.toString(2)
        octElement.value=hexValue.toString(8) 
    }
    
}
decElement.addEventListener("input",decAction)
binElement.addEventListener("input",binAction)
octElement.addEventListener("input",octAction)
hexElement.addEventListener("input",hexAction)