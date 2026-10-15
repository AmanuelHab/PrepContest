const addButton = document.getElementById("add-button");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");
const handlesDiv = document.getElementById("handles");
const handleForm = document.getElementById("handle-form");
const handleInput = document.getElementById("handle-input");
const minRatingInput = document.getElementById("min-rating");
const maxRatingInput = document.getElementById("max-rating");
const problemCountInput = document.getElementById("problem-count");
const generateButton = document.getElementById("generate-button");
const problemsDiv = document.getElementById("problems");

const users = new Set();
renderHandles();
hideLoading();

handleForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    addHandle();
})
addButton.addEventListener('click', () =>{
    addHandle();
});

function validateInputs(){
    console.log("Validating Input");
    hideError();

    if (users.size === 0){
        showError("Add atleast one user needed.");
        return false;
    }

    const minRating = Number(minRatingInput.value.trim());
    if(isNaN(minRating) || minRating % 100 || minRating < 800 || minRating > 3600){
        showError("Invalid minimum rating.");
        return false
    }
    
    const maxRating = Number(maxRatingInput.value.trim());
    if(isNaN(maxRating) || maxRating % 100 || maxRating < 800 || maxRating > 3600){
        showError("Invalid maximum rating.");
        return false
    }
    
    console.log(minRating, maxRating);
    if(minRating > maxRating){
        showError("Invalid rating inputs.");
        return false;
    }

    const problemCount = Number(problemCountInput.value.trim());
    if(isNaN(problemCount) || problemCount < 1 || problemCount > 30){
        showError("Invalid problem count.");
        return false
    }
    return true
}

async function getProblems() {
    showLoading('Fetching problems...');
    const minRating = Number(minRatingInput.value.trim());
    const maxRating = Number(maxRatingInput.value.trim());
    const problemCount = Number(problemCountInput.value.trim());
    const res = await fetch('/api/get_problems', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            minRating: minRating,
            maxRating: maxRating,
            problemCount: problemCount,
            handles: Array.from(users)
        })
    }).then(response => response.json());
    console.log(res);

    if (res.message !== "OK"){
        showError(res.message);
        return;
    }
    return res.data;
}

function renderProblems(problems){
    console.log('Rendering problems');
    problemsDiv.replaceChildren();
    
    problems.forEach((prob) =>{
        const div = document.createElement('div');
        div.classList.add('problem');
        
        const p = document.createElement('span');
        p.textContent = prob;
        div.append(p);
        problemsDiv.append(div);
    })
}

generateButton.addEventListener('click', async ()=>{
    console.log("Generate Button clicked");
    if(validateInputs()){
        const result = await getProblems();
        hideLoading();
        renderProblems(result);
    }
})

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
        handleInput.value = "";
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