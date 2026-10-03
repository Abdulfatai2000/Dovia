import { FileText, ListChecks, ChartNoAxesCombined, Users, CalendarDays, MessageSquare, Sparkles, ShieldCheck, Target, CornerDownRight, BarChart3 } from "lucide-react";
export const marketingLinks = [
  { label:"Features", href:"/features" }, { label:"How it works", href:"/#how-it-works" },
  { label:"Use cases", href:"/#use-cases" }, { label:"Pricing", href:"/pricing" }, { label:"About", href:"/about" },
];
export const coreValues = [
  { title:"AI Meeting Summary", description:"Bring the important points into focus with a draft you can review.", icon:FileText },
  { title:"Action Items & Owners", description:"Make the next step clear, with a person responsible for moving it forward.", icon:ListChecks },
  { title:"Track Follow-ups", description:"Keep completed work, blockers, and overdue commitments in view.", icon:ChartNoAxesCombined },
  { title:"Keep Teams Aligned", description:"Give everyone a shared record of the decisions and work ahead.", icon:Users },
];
export const workflowSteps = [
  {title:"Create meeting",description:"Set the purpose, agenda, and participants."},
  {title:"Add notes or transcript",description:"Bring the conversation into one place."},
  {title:"Dovia organizes the discussion",description:"Explore a structured draft of the outcomes."},
  {title:"Review decisions and actions",description:"Correct the draft before anything is confirmed."},
  {title:"Assign owners and deadlines",description:"Make responsibility and timing explicit."},
  {title:"Track execution",description:"See progress and the work needing attention."},
  {title:"Carry unfinished work forward",description:"Start the next meeting with the right context."},
];
export const useCases = [
  {title:"Team Meetings",description:"Keep shared priorities and responsibilities visible."},
  {title:"Project Reviews",description:"Connect decisions to milestones and delivery."},
  {title:"Client Meetings",description:"Keep commitments and open questions together."},
  {title:"Leadership Meetings",description:"Capture direction and clarify accountable owners."},
  {title:"Weekly Check-ins",description:"Review progress without rebuilding the context."},
  {title:"Planning Sessions",description:"Turn a discussion of possibilities into next steps."},
];
export const integrations = ["Google Meet","Microsoft Teams","Zoom","Slack"];
export const outcomeFlow = ["Conversation","Decision","Action Item","Owner","Deadline","Progress","Follow-up"];
export const featureSections = [
  { title:"Before the meeting", description:"A shared starting point makes the conversation more useful.", items:["Agenda and purpose","Participants and supporting files","Carry-over tasks from earlier meetings"], icon:CalendarDays },
  { title:"During / after the meeting", description:"Capture the context while it is still fresh.", items:["Paste notes or a transcript","Write and refine notes directly","Document selection UI with metadata preview"], icon:MessageSquare },
  { title:"AI Meeting Intelligence", description:"Planned intelligence turns meeting content into a structured draft. The current preview uses illustrative mock results.", items:["Summary and decisions","Action items and open questions","Risks and important notes"], icon:Sparkles },
  { title:"Human Review", description:"People decide what becomes the meeting record. AI output is a starting point for review.", items:["Edit every suggested outcome","Choose owners and review deadlines","Confirm the result explicitly"], icon:ShieldCheck },
  { title:"Action Items & Ownership", description:"Make each commitment understandable and accountable.", items:["Owner and due date","Priority and status","Reviewed action items kept with their source meeting"], icon:Target },
  { title:"Follow-up Tracking", description:"Planned follow-up views will keep the work connected after the meeting ends.", items:["Completed and in-progress work","Blocked and overdue items","Clear next steps for your next check-in"], icon:ListChecks },
  { title:"Carry-over to next meeting", description:"Unfinished work deserves a place in the next conversation.", items:["Unfinished tasks","Unresolved decisions","Earlier context alongside the new agenda"], icon:CornerDownRight },
  { title:"Reports & Insights", description:"Planned reporting will help teams understand execution across their meetings.", items:["Task progress","Follow-up patterns","Work that needs attention"], icon:BarChart3 },
];
export const pricingPlans = [
  {name:"Starter",description:"For exploring a clearer meeting-to-action workflow."},
  {name:"Team",description:"For teams looking to keep decisions and follow-up together."},
  {name:"Organization",description:"For organizations evaluating a shared approach to meeting outcomes."},
];
export const missionQuestions = ["What was decided?","What happens next?","Who owns it?","When is it due?","What still needs attention?"];
export const previewTasks = [
  { title:"Finalize launch checklist",owner:"Sarah Chen",status:"COMPLETED" as const },
  { title:"Review payment integration",owner:"David Liu",status:"IN_PROGRESS" as const },
];
export const followUpMetrics = [{value:8,label:"Total Tasks"},{value:5,label:"Completed"},{value:2,label:"In Progress"},{value:1,label:"Overdue"}];
export const previewActivity = ["Sarah completed the launch checklist.","David updated the payment integration task.","One overdue task is ready for the next check-in."];
