import { Button } from "@/components/ui/button"
import type { ExpenseProofDto } from "../../../type/Types"

function ExpenseProofCard({proof}:{proof:ExpenseProofDto}) {

  const hanleOpenDocument = () => {
    window.open(proof.proofDocumentUrl, "_blank")
  }

  return (
    <div className="border-2 p-3 rounded-lg">
        <div onClick={hanleOpenDocument}>
            <img src={proof.proofDocumentUrl} className="w-20"/>
        </div>
        <div>
          {proof.documentType}
        </div>
        <div className="flex justify-center p-2">
          <Button onClick={hanleOpenDocument} className="">View</Button>
        </div>
    </div>
  )
}

export default ExpenseProofCard
