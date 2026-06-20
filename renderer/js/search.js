const medicineSearchElem = document.querySelector('#medicine-searchbar')

medicineSearchElem.addEventListener('input', async (e) => {
    const value = e.target.value
    const msg = await window.api.searchMedicine(value)

    console.log(msg);
})
