import { receiptItems, saveReceiptItems, removeFromReceipt, showReceipt } from "./data/receiptItems.js"
import { formatRupee } from "./utilities/money.js"
import { showResults, currentResults } from "./search.js"
import { updateSummary } from "./summary.js"

const receiptBodyElem = document.querySelector('#receipt-body')

showReceipt()

// remove btn listener
receiptBodyElem.addEventListener('click', (e)=>{
    const removeBtn = e.target.closest('.receipt-row__remove')
    if(!removeBtn) return

    const row = removeBtn.closest('.receipt-row')
    const id = Number(row.dataset.id)

    removeFromReceipt(id)
    showReceipt()
    updateSummary()
    showResults(currentResults)
})

// Update qty and discount input
receiptBodyElem.addEventListener('change', (e) => {
    const input = e.target.closest('.receipt-input')
    if (!input) return

    const row = input.closest('.receipt-row')
    const id = Number(row.dataset.id)

    const field = input.dataset.field  
    let value = Number(input.value)

    
    const item = receiptItems.find(item => item.id === id)

    const fields = {
        "discount":{
            min: 0,
            max: 100
        },
        "qty":{
            min: 1,
            max: item['totalQty']
        }
    }

    if(value < fields[field].min) value = fields[field].min
    else if(value > fields[field].max) value = fields[field].max

    item[field] = value
    item['amount'] = (item['mrp'] - (item['discount'] / 100) * item['mrp']) * item['qty'] 
    saveReceiptItems()

    showReceipt()
    updateSummary()
    showResults(currentResults)
})
