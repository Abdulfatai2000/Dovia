"use client";

// Component-only review fixture. Intentionally not exposed as an application route.
import { useState } from "react";
import { Calendar, Check, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import {
  Avatar, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, Divider, Dropdown, EmptyState, ErrorState, FilterChip, IconButton, Input,
  LoadingState, Modal, PageHeader, PriorityBadge, Progress, SearchInput, SectionHeader,
  Select, Skeleton, StatusBadge, Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow, Tabs, Textarea, Toast, Tooltip,
  type BadgeVariant, type ButtonVariant,
} from "@/components/ui";
import { AIProcessingState } from "@/components/ai/ai-processing-state";
import type { MeetingStatus, TaskPriority, TaskStatus } from "@/types";

const buttonVariants: ButtonVariant[] = ["primary", "secondary", "outline", "ghost", "danger", "success", "gradient"];
const badgeVariants: BadgeVariant[] = ["default", "primary", "success", "warning", "danger", "info", "neutral", "ai"];
const statuses: (MeetingStatus | TaskStatus)[] = ["DRAFT", "SCHEDULED", "IN_PROGRESS", "PROCESSING", "REVIEW", "COMPLETED", "CANCELLED", "NOT_STARTED", "BLOCKED", "OVERDUE"];
const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function DesignSystemPreview() {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState("No action selected");
  const [toast, setToast] = useState(true);
  return <main className="dovia-page mx-auto max-w-6xl space-y-8">
    <PageHeader eyebrow="Dovia / Design system" title="Clarity in every detail." description="Turn conversations into action. A reusable foundation for a focused, human workspace." actions={<Button variant="gradient"><Sparkles aria-hidden="true" />Primary action</Button>} />
    <section className="space-y-4" aria-label="Brand and typography">
      <SectionHeader title="A clear foundation" description="Restrained color. Readable type. Space to focus." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><div className="h-16 rounded-default bg-primary" /><CardTitle>Primary blue</CardTitle><CardDescription>Focused actions and navigation.</CardDescription></CardHeader></Card>
        <Card><CardHeader><div className="h-16 rounded-default bg-sidebar" /><CardTitle>Workspace navy</CardTitle><CardDescription>A grounded workspace foundation.</CardDescription></CardHeader></Card>
        <Card><CardHeader><div className="dovia-gradient h-16 rounded-default" /><CardTitle>AI violet</CardTitle><CardDescription>Selective highlights for intelligence.</CardDescription></CardHeader></Card>
      </div>
    </section>
    <section className="space-y-4" aria-label="Buttons">
      <SectionHeader title="Actions" />
      <Card><CardHeader><CardTitle>Buttons and controls</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">{buttonVariants.map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}</div>
        <div className="flex flex-wrap items-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button disabled>Disabled</Button><Button loading loadingText="Saving">Save</Button><Button><Plus aria-hidden="true" />With icon</Button></div>
        <div className="flex flex-wrap items-center gap-3"><Tooltip content="Search your workspace"><IconButton aria-label="Search workspace"><Search aria-hidden="true" /></IconButton></Tooltip><FilterChip selected={selected} onClick={() => setSelected(!selected)}>Priority filter</FilterChip></div>
      </CardContent></Card>
    </section>
    <section className="space-y-4" aria-label="Forms">
      <SectionHeader title="Thoughtful forms" />
      <Card><CardHeader><CardTitle>Fields with context</CardTitle><CardDescription>Visible labels, clear feedback, and consistent focus.</CardDescription></CardHeader><CardContent>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={event => event.preventDefault()}>
          <Input label="Meeting title" placeholder="e.g. Product Strategy Sync" required leftIcon={<Calendar />} helperText="Choose a short, descriptive title." />
          <Input label="Email address" type="email" defaultValue="invalid" error="Enter a valid email address." />
          <Input label="Disabled field" disabled placeholder="Unavailable" />
          <Select label="Priority" placeholder="Choose a priority" options={priorities.map(value => ({ value, label: value }))} />
          <Textarea label="Meeting notes" placeholder="Add context for the discussion..." showCount maxLength={500} wrapperClassName="md:col-span-2" />
          <SearchInput /><Checkbox label="Include a reminder" /><Checkbox label="Unavailable option" disabled />
        </form>
      </CardContent></Card>
    </section>
    <section className="space-y-4" aria-label="Statuses">
      <SectionHeader title="Meaning at a glance" />
      <Card><CardHeader><CardTitle>Badges and people</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">{badgeVariants.map(variant => <Badge key={variant} variant={variant}>{variant}</Badge>)}</div>
        <div className="flex flex-wrap gap-2">{statuses.map(status => <StatusBadge key={status} status={status} />)}</div>
        <div className="flex flex-wrap gap-2">{priorities.map(priority => <PriorityBadge key={priority} priority={priority} />)}</div>
        <Divider /><div className="flex flex-wrap items-center gap-3">{(["xs", "sm", "md", "lg", "xl"] as const).map(size => <Avatar key={size} name="Sarah Chen" size={size} />)}<Avatar name="Abdulfatai" /><Avatar name="Broken image fallback" src="data:image/png;base64,invalid" /></div>
      </CardContent></Card>
    </section>
    <section className="space-y-4" aria-label="Interactive components">
      <SectionHeader title="Connected interactions" />
      <Card><CardHeader><CardTitle>Tabs, menus, and dialogs</CardTitle></CardHeader><CardContent className="space-y-5">
        <Tabs label="Component examples" items={[{ value: "overview", label: "Overview", content: <p>Overview panel</p> }, { value: "disabled", label: "Unavailable", disabled: true, content: <p>Disabled panel</p> }, { value: "details", label: "Details", content: <p>Details panel</p> }, { value: "activity", label: "Activity", content: <p>Activity panel</p> }]} />
        <div className="flex flex-wrap gap-3"><Dropdown label="Example actions" trigger="Actions" items={[{ id: "edit", label: "Edit", onSelect: () => setMessage("Edit selected") }, { id: "disabled", label: "Unavailable action", disabled: true, onSelect: () => setMessage("Should not run") }, { id: "delete", label: "Delete", destructive: true, icon: <Trash2 />, onSelect: () => setMessage("Delete selected") }]} /><Button onClick={() => setModal(true)}>Open dialog</Button></div>
        <p role="status" className="text-sm text-text-muted">{message}</p>
      </CardContent><CardFooter><p className="text-sm text-text-muted">Keyboard navigation and visible focus are built in.</p></CardFooter></Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Confirm this action" description="A reusable dialog with native focus containment." onConfirm={() => { setMessage("Confirmed"); setModal(false); }}>
        <Input label="Confirmation note" placeholder="Optional context" />
      </Modal>
    </section>
    <section className="space-y-4" aria-label="Tables and progress">
      <SectionHeader title="Structured information" />
      <Table containerLabel="Scrollable example table"><TableCaption>Example component data only.</TableCaption><TableHeader><TableRow>{["Task", "Source Meeting", "Owner", "Deadline", "Priority", "Status", "Actions"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody><TableRow><TableCell>Review proposal</TableCell><TableCell>Planning session</TableCell><TableCell>Sarah Chen</TableCell><TableCell>Friday</TableCell><TableCell><PriorityBadge priority="HIGH" /></TableCell><TableCell><StatusBadge status="IN_PROGRESS" /></TableCell><TableCell><IconButton aria-label="Mark example complete"><Check aria-hidden="true" /></IconButton></TableCell></TableRow></TableBody></Table>
      <Progress value={67} label="Follow-up progress" />
    </section>
    <section className="space-y-4" aria-label="Feedback">
      <SectionHeader title="Helpful feedback" />
      <div className="grid gap-4 md:grid-cols-2">{(["success", "error", "warning", "info"] as const).map(variant => <Toast key={variant} variant={variant} title={variant + " feedback"} description="Clear, contextual feedback for the next step." />)}{toast && <Toast title="Dismissible feedback" onDismiss={() => setToast(false)} />}</div>
      <EmptyState icon={<Calendar />} title="Nothing here yet" description="Start with one focused action." action={<Button>Get started</Button>} />
      <ErrorState description="We couldn't load this example." onRetry={() => setMessage("Retry selected")} />
      <LoadingState label="Loading component preview..." /><div className="space-y-3" aria-label="Loading content"><Skeleton className="h-20" /><Skeleton className="w-2/3" /></div>
      <AIProcessingState state="idle" /><AIProcessingState state="processing" step={2} /><AIProcessingState state="success" /><AIProcessingState state="error" />
    </section>
  </main>;
}
