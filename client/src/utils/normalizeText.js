export default str => str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
