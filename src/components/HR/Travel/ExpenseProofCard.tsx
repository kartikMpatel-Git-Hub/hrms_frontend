import type { ExpenseProofDto } from "../../../type/Types"

function ExpenseProofCard({proof}:{proof:ExpenseProofDto}) {
  return (
    <div>
        <div>
            <img src={proof.proofDocumentUrl} className="w-20"/>
        </div>
        <div>
            <div>{proof.remakrs}</div>
        </div>
    </div>
  )
}

export default ExpenseProofCard
