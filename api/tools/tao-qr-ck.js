let banks = []
let selectedBank = null

fetch("https://api.vietqr.io/v2/banks")
.then(r=>r.json())
.then(res=>{
banks = res.data.filter(b=>b.transferSupported==1)
renderBanks(banks)
})

function renderBanks(list){
let html=""
list.forEach(bank=>{
html+=`
<div class="bank" onclick="selectBank('${bank.bin}','${bank.shortName}',this)">
<img src="${bank.logo}">
<span>${bank.shortName}</span>
</div>`
})
document.getElementById("bankList").innerHTML=html
}

function selectBank(bin,name,el){
selectedBank=bin
document.querySelectorAll(".bank").forEach(b=>b.classList.remove("active"))
el.classList.add("active")
document.getElementById("bankSearch").value=name
updateQR()
}

document.getElementById("bankSearch").oninput=function(){
let v=this.value.toLowerCase()
let filtered=banks.filter(b=>b.shortName.toLowerCase().includes(v))
renderBanks(filtered)
}

function formatMoney(x){
return x.replace(/\B(?=(\d{3})+(?!\d))/g,".")
}

document.getElementById("amount").addEventListener("input",function(){
let val=this.value.replace(/\D/g,"")
this.value=formatMoney(val)
updateQR()
})

document.getElementById("stk").oninput=updateQR
document.getElementById("des").oninput=updateQR
document.getElementById("template").onchange=updateQR

function updateQR(){
let stk=document.getElementById("stk").value
let amount=document.getElementById("amount").value.replace(/\./g,"")
let des=document.getElementById("des").value
let template=document.getElementById("template").value
let accName=document.getElementById("accName")?document.getElementById("accName").value:""

if(!stk||!selectedBank)return

if(!template)template="compact"

let url=`https://img.vietqr.io/image/${selectedBank}-${stk}-${template}.png`

let params=[]

if(amount)params.push(`amount=${amount}`)
if(des)params.push(`addInfo=${encodeURIComponent(des)}`)
if(accName)params.push(`accountName=${encodeURIComponent(accName)}`)

if(params.length)url+="?"+params.join("&")

document.getElementById("qrimg").src=url
document.querySelector(".tools").style.display="flex"
}

function downloadQR(){
let img=document.getElementById("qrimg").src
if(!img)return
let a=document.createElement("a")
a.href=img
a.download="qr.png"
a.click()
}

function copyDes(){
let text=document.getElementById("des").value
navigator.clipboard.writeText(text)
alert("Đã copy nội dung")
}