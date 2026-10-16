export const checkUser = async(req, res) =>{
    try{
        const handle = req.params.handle;
        const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`;
        const response = await fetch(url);
        
        if (!response.ok){
            if (response.status === 400){
                    return res.status(404).json({message: "User not found."});
            }
            return res.status(502).json({message: "Bad response from Codeforces API."});
        }

        const result = await response.json();
        return res.status(200).json({message: "User found.", data: result.result[0]});
    }catch(error){
        return res.status(502).json({message: "Failed to verify Codeforces user."});
    }
}

const findSolvedProblems = async(handle) =>{
    try{
        const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`;
        const response = await fetch(url);
        if (!response.ok){
            throw new Error("Error: Failed to fetch submissions")
        }
        const data = await response.json();

        if (data.status !== 'OK'){
            throw new Error(`Error: Codeforces API returned status "${data.status}" for handle "${handle}"`);
        }
        const submissions = data.result;
        const solvedProblems = new Set();

        for (const sub of submissions){
            if(sub.verdict === "OK"){
                const problem = sub.problem; 
                const pID = `${problem.contestId}_${problem.index}`;
                solvedProblems.add(pID);
            }
        }
        return solvedProblems;
    }catch(error){
        throw new Error('Cannot connect to Codeforces API');
    }
}
const getProblemSet = async() =>{
    const url = 'https://codeforces.com/api/problemset.problems';
    const result = await fetch(url).then((response) => response.json());

    const problems = result.result.problems;
    const structured_problems = new Map();
    for(const prob of problems){
        const pID = `${prob.contestId}_${prob.index}`;
        structured_problems.set(pID, prob);
    }
    return structured_problems
}

function getRandomProblems(arr, count){
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

export const getProblems = async(req, res) =>{
    // Take inputs
    const minRating = req.body.minRating;
    const maxRating = req.body.maxRating;
    const problemCount = req.body.problemCount;
    const handles = req.body.handles;
    console.log(minRating, typeof(minRating), maxRating, typeof(maxRating), problemCount, typeof(problemCount), handles, typeof(handles));

    // Prepare a filtered problem set
    const problemSet = await getProblemSet();
    const allSolvedProblems = new Set();
    for(const handle of handles){
        try{
            const sub = await findSolvedProblems(handle);
            sub.forEach(element => {
                allSolvedProblems.add(element);
            });
        }catch(error){
            return res.json({error:error.message});
        }
    }
    // Remove the solved ones
    allSolvedProblems.forEach((sub) =>{
        problemSet.delete(sub);
    });
    
    // Filter with rating
    const filteredProblemSet = [];
    problemSet.forEach((problem, pID) =>{
        if (minRating <= problem.rating && problem.rating <= maxRating){
            filteredProblemSet.push(pID);
        }
    });

    if(filteredProblemSet.length < problemCount){
        return res.status(404).json({message: "Fewer problems found."})
    }

    res.status(200).json({
        message: "OK",
        data: getRandomProblems(filteredProblemSet, problemCount)
    });

}