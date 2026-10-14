const addButton = document.getElementById("add-button");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");
const handlesDiv = document.getElementById("handles");
const handleForm = document.getElementById("handle-form");
const handleInput = document.getElementById("handle-input");

const users = new Set();
renderHandles();
hideLoading();

handleForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    addHandle();
})
addButton.addEventListener('click', () =>{
    addHandle();
    renderHandles();
});

async function addHandle(){
    const handle = handleInput.value.trim();

    hideError();

    if (!handle){
        showError("Please enter a Codeforces handle.");
        return;
    }
    
    if (users.has(handle.toLowerCase())){
        showError("The handle is already included");
        return;
    }

    showLoading("Checking handle...");
    
    try{
        const result = await fetch(`/api/check/${encodeURIComponent(handle)}`);
        console.log(result);
        if (!result.ok){
            throw new Error("User not found");
        }
        users.add(handle);
        renderHandles();
        
    }catch(error){
        showError(error);
    }finally{
        hideLoading();
    }

}

function renderHandles(){
    handlesDiv.replaceChildren();

    Array.from(users).forEach((user) =>{
        const div = document.createElement("div");
        div.classList.add('handles');

        const par = document.createElement("span");
        par.textContent = user;

        div.append(par);
        handlesDiv.append(div);
    }
    );
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