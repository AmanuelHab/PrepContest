const addButton = document.getElementById("add-button");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

const handleInput = document.getElementById("handle-input");


const users = new Set();

addButton.addEventListener('onclick', () =>{
    addUser();
});

async function addHandle(){
    const handle = handleInput.value.trim();
    if (!handle){
        showError("Please enter a Codeforces handle");
        return;
    }

    try{
        const result = await fetch(`/check/${encodeURIComponent(handle)}`);
        if (result.ok && result.message === "NO"){
            showError("User not found");
        }
        
    }catch(error){
        showError(error.message);
    }finally{
        hideLoading();
    }

}
function showError(message = ""){
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}
function hideError(){
    errorDiv.classList.add("hidden");
}
function showLoading(message = ""){
    loadingDiv.textContent = message;
    loadingDiv.classList.remove("hidden");
}
function hideLoading(){
    loadingDiv.classList.add("hidden");
}