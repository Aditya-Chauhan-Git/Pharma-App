import { addToReceipt, showReceipt, receiptItems } from "./data/receiptItems.js"
import { updateSummary } from "./summary.js"

const searchElem = document.querySelector('#search')
const medicineSearchElem = document.querySelector('#medicine-searchbar')
const suggestionsElem = document.querySelector('#suggestions')

export let currentResults = []

export function showResults(results) {

    let html = ''
    currentResults = results
    results.forEach(result => {
        const inReceipt = receiptItems.find(item => Number(item.id) === Number(result.id))
        const receiptQty = inReceipt ? inReceipt.qty : 0
        const availableQty = result.quantity + result.free_quantity - receiptQty
        
        html += `
        
        <div class="suggestions-row" data-id="${result.id}" ${availableQty === 0 ? "data-qty-details='outOfStock'" : "data-qty-details='available'"} tabindex="-1">
            <div class="suggestions-row__name">${result.name}</div>
            <div class="suggestions-row__mrp">₹${result.mrp}</div>
            <div class="suggestions-row__qty">${availableQty === 0 ? "outOFStock" : availableQty}</div>
        </div>
        
        `
    })
    suggestionsElem.innerHTML = html
}

medicineSearchElem.addEventListener('input', async (e) => {
    const value = e.target.value
    const results = await window.searchApi.searchByLetter(value)

    showResults(results)
})

suggestionsElem.addEventListener('click', async (e) => {
    const row = e.target.closest('.suggestions-row')
    if (!row) return

    const qtyDetail = row.dataset.qtyDetails

    if (qtyDetail === "outOfStock") {
        return
    }

    const rowId = row.dataset.id
    const medicineObj = await window.searchApi.searchById(rowId)

    addToReceipt(medicineObj)
    showReceipt()
    updateSummary()
    showResults(currentResults)
});


searchElem.addEventListener('focusout', (e)=>{
    if(searchElem.contains(e.relatedTarget)) return 
    suggestionsElem.style.display = 'none'
})
searchElem.addEventListener('focusin', ()=>{
    suggestionsElem.style.display = 'block'
})