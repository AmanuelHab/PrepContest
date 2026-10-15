export const checkUser = async(req, res) =>{
    const handle = req.params.handle;
    const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`;
    const result = await fetch(url).then((response) => response.json());
    
    if (result.status === 'OK'){
        return res.status(200).json({message: "YES"});
    }
    res.status(404).json({message: "NO"});
}

const findSolvedProblems = async(handle) =>{
    const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`;
    const result = await fetch(url).then((response) => response.json());

    const submissions = result.result;
    const solvedProblems = new Set();

    for (const sub of submissions){
        if(sub.verdict === "OK"){
            const problem = sub.problem; 
            const pID = `${problem.contestId}_${problem.index}`;
            solvedProblems.add(pID);
        }
    }
    return solvedProblems;
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
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
        const sub = await findSolvedProblems(handle);
        sub.forEach(element => {
            allSolvedProblems.add(element);
        });
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