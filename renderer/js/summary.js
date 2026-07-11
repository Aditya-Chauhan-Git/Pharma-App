import { receiptItems, resetReceipt, showReceipt } from "./data/receiptItems.js"
import { formatRupee } from "./utilities/money.js"

const sellBtn = document.querySelector('#sell-btn')

export function updateSummary() {
    let totalMedicines = 0
    let totalUnits = 0
    let totalAmount = 0
    receiptItems.forEach(items => {
        totalMedicines++
        totalUnits += items.qty
        totalAmount += items.amount
    })

    totalAmount = formatRupee(totalAmount)

    document.querySelector('#total-medicines').innerText = totalMedicines
    document.querySelector('#total-units').innerText = totalUnits
    document.querySelector('#total-amount').innerText = totalAmount
}

sellBtn.addEventListener('click', async ()=>{
    if(receiptItems.length === 0) return

    const result = await window.receiptApi.sell(receiptItems)
    if(result.success){
        resetReceipt()
        showReceipt()
    } else{
        console.log('Sell failed:', result.message)
    }
})