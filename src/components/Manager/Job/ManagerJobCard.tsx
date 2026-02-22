import { type JobResponseDto } from '@/type/Types'
import { ALargeSmall, Briefcase, Eye, File, LucideUserPlus, Mail, Send, Text, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState, type ChangeEvent } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TableCell, TableRow } from '@/components/ui/table'

interface ManagerJobCardProp {
  job: JobResponseDto
  isPending: boolean
  isCompleted: boolean
  idx: number
  handleReferred: (id: number, dto: any, cv: File) => void
  handleShare: (id: number, email: string) => void
}

function ManagerJobCard({ job, idx, isPending, handleReferred, handleShare, isCompleted }: ManagerJobCardProp) {
  const [shareEmail, setShareEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [referenceRequest, setReferrenceRequest] = useState({
    ReferedPersonName: "",
    ReferedPersonEmail: "",
    Note: ""
  })
  const [cv, setCv] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCv(e.target.files[0])
    }
  }

  useEffect(() => {
    if (isCompleted == true) {
      setReferrenceRequest({
        ReferedPersonName: "",
        ReferedPersonEmail: "",
        Note: ""
      })
      setError("")
      setErrors([])
      setCv(null)
      setShareEmail("")
    }
  }, [isCompleted])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setReferrenceRequest((prev) => ({ ...prev, [name]: value }))
  }

  const isValidForm = () => {
    var flag = true
    if (!referenceRequest.ReferedPersonName.trim() || referenceRequest.ReferedPersonName.trim().length < 2 || referenceRequest.ReferedPersonName.trim().length > 50) {
      setErrors((p) => [...p, "Person name should contain 2 to 50 characters!"])
      flag = false
    }
    if (!referenceRequest.ReferedPersonEmail.trim() || referenceRequest.ReferedPersonEmail.trim().length < 2 || referenceRequest.ReferedPersonEmail.trim().length > 50) {
      setErrors((p) => [...p, "Person email should contain 2 to 50 characters!"])
      flag = false
    } else {
      if (!validateEmail(referenceRequest.ReferedPersonEmail)) {
        setErrors((p) => [...p, "Invalid email"])
        flag = false
      }
    }
    if (!referenceRequest.Note.trim() || referenceRequest.Note.trim().length < 2 || referenceRequest.Note.trim().length > 500) {
      setErrors((p) => [...p, "Note should contain 2 to 500 characters!"])
      flag = false
    }
    if (!cv) {
      setErrors((p) => [...p, "Person CV is required!"])
      flag = false
    }
    return flag
  }

  const handleReferredSubmit = () => {
    setErrors([])
    if (!isValidForm()) {
      return
    }
    if (cv)
      handleReferred(job.id, referenceRequest, cv)
  }

  const handleShareSubmit = () => {
    if (!shareEmail.trim()) {
      setError("Email cannot be empty!")
      return
    }
    else if (!validateEmail(shareEmail.trim())) {
      setError("Please enter a valid email!")
      return
    }
    handleShare(job.id, shareEmail)
  }

  function validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  return (
    <TableRow>
      <TableCell>{idx + 1}</TableCell>
      <TableCell>{job.title}</TableCell>
      <TableCell>{job.jobRole}</TableCell>
      <TableCell>{job.isActive ? "Active" : "Closed"}</TableCell>
      <TableCell className='flex gap-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" title='View Job Details'>
              <Eye />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className='flex'><Briefcase className='w-4 h-5 mr-1' /> JOB DETAILS<span className='text-sm'>{job.isActive ? "(Active)" : "(Closed)"}</span></DialogTitle>
              <DialogDescription>
                Job Details and Requirements
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-2'>
              <div><span className='font-bold mr-1 italic'>Title:</span>{job.title.toUpperCase()}</div>
              <div><span className='font-bold mr-1 italic'>Role:</span>{job.jobRole.toUpperCase()}</div>
              <div><span className='font-bold mr-1 italic'>Place:</span>{job.place.toUpperCase()}</div>
              <div><span className='font-bold mr-1 italic'>Requirements:</span>{job.requirements}</div>
              <Button onClick={() => window.open(job.jdUrl, "_blank")}><Eye /> View JD</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" title='Share Job'>
              <Send />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className='flex'><Send className='w-4 h-5 mr-1' />SHARE JOB</DialogTitle>
              <DialogDescription>
                Enter email to share this job with someone
              </DialogDescription>
            </DialogHeader>
            <div>
              <Field>
                <FieldLabel htmlFor="share-email">
                  <ALargeSmall className="w-4 h-4" />Email
                </FieldLabel>
                <Input
                  id="share-email"
                  placeholder="Enter email to share"
                  required
                  value={shareEmail}
                  onChange={(e) => {
                    setShareEmail(e.target.value)
                    if (error) setError("")
                  }}
                />
              </Field>
            </div>
            <DialogFooter>
              <div className='mt-2'>
                <Button onClick={handleShareSubmit} disabled={isPending}><Send /> Send</Button>
              </div>
            </DialogFooter>
            {error && <div className='text-sm text-red-600'>{error}</div>}
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" title='Refer'>
              <LucideUserPlus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className='flex'><LucideUserPlus className='w-4 h-5 mr-1' />REFER JOB</DialogTitle>
              <DialogDescription>
                Enter details of the person you want to refer
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-2'>
              <Field>
                <FieldLabel htmlFor="refer-name">
                  <User className="w-4 h-4" />Referred Person Name
                </FieldLabel>
                <Input
                  id="refer-name"
                  placeholder="Enter name"
                  required
                  name="ReferedPersonName"
                  value={referenceRequest.ReferedPersonName}
                  onChange={handleInputChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="refer-email">
                  <Mail className="w-4 h-4" />Referred Person Email
                </FieldLabel>
                <Input
                  id="refer-email"
                  placeholder="Enter email"
                  required
                  name="ReferedPersonEmail"
                  value={referenceRequest.ReferedPersonEmail}
                  onChange={handleInputChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="refer-note">
                  <Text className="w-4 h-4" />Note*
                </FieldLabel>
                <Textarea
                  id="refer-note"
                  placeholder="Enter details about this person"
                  required
                  name="Note"
                  value={referenceRequest.Note}
                  onChange={handleInputChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="refer-cv">
                  <File className="w-4 h-4" />Upload CV*
                </FieldLabel>
                <Input
                  id="refer-cv"
                  type='file'
                  onChange={handleFileChange}
                />
              </Field>

              <DialogFooter>
                <div className='mt-2'>
                  <Button onClick={handleReferredSubmit} disabled={isPending}>
                    <Send /> Send
                  </Button>
                </div>
              </DialogFooter>

              {errors.length > 0 && (
                <div>
                  {errors.map((e, idx) => (
                    <p key={idx} className='text-red-600 text-sm'>{e}</p>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

export default ManagerJobCard
