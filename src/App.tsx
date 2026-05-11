import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
} from '@/components/ui'

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-16">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">TrueFit</h1>
          <p className="mt-1 text-sm text-muted-foreground">Design system preview</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>All variants and states</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>With label, hint, and error states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Job title" placeholder="e.g. Frontend Developer" />
            <Input
              label="Email"
              placeholder="you@example.com"
              hint="We will never share your email."
            />
            <Input
              label="API key"
              placeholder="sk-..."
              error="This field is required."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Skill context and status indicators</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="default">Professional</Badge>
            <Badge variant="secondary">Academic</Badge>
            <Badge variant="success">Applied</Badge>
            <Badge variant="destructive">Rejected</Badge>
            <Badge variant="outline">Learning</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spinner</CardTitle>
            <CardDescription>Loading states</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
