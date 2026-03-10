let banks = []
let selectedBank = null

fetch("https://api.vietqr.io/v2/banks")
    .then(r => r.json())
    .then(res => {
        banks = res.data.filter(b => b.transferSupported == 1)
        renderBanks(banks)
    })

function renderBanks(list) {
    let html = ""

    list.forEach(bank => {
        html += `
<div class="bank" onclick="selectBank('${bank.bin}','${bank.shortName}',this)">
<img src="${bank.logo}">
<span>${bank.shortName}</span>
</div>`
    })

    document.getElementById("bankList").innerHTML = html
}

function selectBank(bin, name, el) {

    selectedBank = bin

    document.querySelectorAll(".bank").forEach(b => b.classList.remove("active"))
    el.classList.add("active")

    document.getElementById("bankSearch").value = name

    updateQR()

}

document.getElementById("bankSearch").oninput = function () {

    let v = this.value.toLowerCase()

    let filtered = banks.filter(b => b.shortName.toLowerCase().includes(v))

    renderBanks(filtered)

}

function formatMoney(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

document.getElementById("amount").addEventListener("input", function () {

    let val = this.value.replace(/\D/g, "")

    this.value = formatMoney(val)

    updateQR()

})

document.getElementById("stk").oninput = updateQR
document.getElementById("des").oninput = updateQR
document.getElementById("template").onchange = updateQR


function updateQR() {

    let stk = document.getElementById("stk").value
    let amount = document.getElementById("amount").value.replace(/\./g, "")
    let des = document.getElementById("des").value
    let template = document.getElementById("template").value

    if (!stk || !selectedBank) return

    let url = `https://qr.sepay.vn/img?acc=${stk}&bank=${selectedBank}`

    if (amount) url += `&amount=${amount}`
    if (des) url += `&des=${encodeURIComponent(des)}`
    if (template) url += `&template=${template}`

    document.getElementById("qrimg").src = url

    document.querySelector(".tools").style.display = "flex"

}

function downloadQR() {

    let img = document.getElementById("qrimg").src

    if (!img) return

    let a = document.createElement("a")

    a.href = img + "&download=true"

    a.download = "qr.png"

    a.click()

}

function copyDes() {

    let text = document.getElementById("des").value

    navigator.clipboard.writeText(text)

    alert("Đã copy nội dung")

}