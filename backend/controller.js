export const checkUser = async(req, res) =>{
    const handle = req.body.handle;
    const url = `https://codeforces.com/api/user.info?handle=${handle}`;
    const result = await fetch(url);
    if (result.status === "OK"){
        return res.json({message: "YES"});
    }
    res.json({message: "NO"});
}

const findSubmissions = async(handle) =>{
    const url = `https://codeforeces.com/api/user.status?handle=${handle}`;
    const result = await fetch(url);

    if (result.status === "FAILED"){
        return res.json({message: "FAILED"});
    }
    const submissions = result.submissions;
    const solvedProblems = new Set();

    for (sub of submissions){
        if(sub.verdict === "OK"){
            const problem = sub.problem; 
            const pID = `${problem.contestId}_${problem.index}`;
            solvedProblems.add(pID);
        }
    }
    return solvedProblems;
}

export const findProblems = async(req, res) =>{
    const handles = req.body.handles;
    const allSolvedProblems = new Set();

    for(handle of handles){
        sub = findSubmissions(handle);
        sub.array.forEach(element => {
            allSolvedProblems.add(element);
        });
    }
    const url = `https:/codeforces.com/api/problemset.problems`;
    const result = await fetch(url);
    if (result.status === "FAILED"){
        return res.json({message: "FAILED"})
    }

}