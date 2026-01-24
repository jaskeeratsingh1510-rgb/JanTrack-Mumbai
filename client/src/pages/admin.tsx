import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists, if not use Input
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save, CheckCircle, Trash2 } from "lucide-react";

// Types
interface PromiseItem {
    id: string;
    title: string;
    description: string;
    status: "completed" | "in-progress" | "not-started" | "broken";
    category: string;
    completionPercentage: number;
}

interface Project {
    name: string;
    cost: number;
    status: string;
}

interface Candidate {
    id: string;
    name: string;
    party: string;
    constituency: string;
    ward: string;
    age: number;
    education: string;
    image: string;
    criminalCases: number;
    assets: string;
    attendance: number;
    promises: PromiseItem[];
    funds: {
        allocated: number;
        utilized: number;
        projects: Project[];
    };
    bio: string;
}

const defaultCandidate: Candidate = {
    id: "",
    name: "",
    party: "",
    constituency: "",
    ward: "",
    age: 0,
    education: "",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    criminalCases: 0,
    assets: "",
    attendance: 0,
    promises: [],
    funds: {
        allocated: 0,
        utilized: 0,
        projects: []
    },
    bio: ""
};

export default function AdminPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Candidate>(defaultCandidate);

    const { data: candidates, isLoading, error } = useQuery<Candidate[]>({
        queryKey: ["/api/candidates"],
    });

    const sortedCandidates = [...(candidates || [])].sort((a, b) => {
        return (parseInt(a.id) || 0) - (parseInt(b.id) || 0);
    });

    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["/api/user"],
    });

    useEffect(() => {
        if (!isUserLoading && !user) {
            window.location.href = "/admin/login";
        }
    }, [user, isUserLoading]);



    const createMutation = useMutation({
        mutationFn: async (newCandidate: Candidate) => {
            const res = await fetch("/api/candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCandidate),
            });
            if (!res.ok) throw new Error("Failed to create candidate");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
            toast({ title: "Success", description: "Candidate created successfully" });
            setIsOpen(false);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create candidate", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (candidate: Candidate) => {
            const res = await fetch(`/api/candidates/${candidate.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(candidate),
            });
            if (!res.ok) throw new Error("Failed to update candidate");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
            toast({ title: "Success", description: "Candidate updated successfully" });
            setIsOpen(false);
            setEditingId(null);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update candidate", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/candidates/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete candidate");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
            toast({ title: "Success", description: "Candidate deleted successfully" });
        },
    });

    if (isUserLoading) return null; // or a loading spinner

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto p-8 text-red-500">
                    Error loading candidates: {(error as Error).message}
                </div>
            </Layout>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Manual Validation
        if (!formData.id || !formData.name || !formData.party || !formData.constituency) {
            toast({
                title: "Validation Error",
                description: "Please fill in ID, Name, Party, and Constituency in the Overview tab.",
                variant: "destructive"
            });
            return;
        }

        console.log("Submitting form data:", formData);

        if (editingId) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const resetForm = () => {
        setFormData(defaultCandidate);
        setEditingId(null);
    };

    const handleEdit = (candidate: Candidate) => {
        // Ensure deep copy and default values for new fields if missing
        setFormData({
            ...defaultCandidate,
            ...candidate,
            funds: { ...defaultCandidate.funds, ...(candidate.funds || {}) },
            promises: candidate.promises || [],
        });
        setEditingId(candidate.id);
        setIsOpen(true);
    };

    const addPromise = () => {
        setFormData({
            ...formData,
            promises: [
                ...formData.promises,
                { id: Date.now().toString(), title: "New Promise", description: "", status: "not-started", category: "General", completionPercentage: 0 }
            ]
        });
    };

    const removePromise = (index: number) => {
        const newPromises = [...formData.promises];
        newPromises.splice(index, 1);
        setFormData({ ...formData, promises: newPromises });
    };

    const addProject = () => {
        setFormData({
            ...formData,
            funds: {
                ...formData.funds,
                projects: [...formData.funds.projects, { name: "New Project", cost: 0, status: "Planned" }]
            }
        });
    };

    const removeProject = (index: number) => {
        const newProjects = [...formData.funds.projects];
        newProjects.splice(index, 1);
        setFormData({
            ...formData,
            funds: { ...formData.funds, projects: newProjects }
        });
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Debugging: Show error if API fails */}
                {/* @ts-ignore */}
                {/* using internal query debugging */}
                {isLoading && <div className="text-blue-500">Loading Admin Data...</div>}

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold font-serif text-primary">Admin Dashboard</h1>

                        <div className="flex items-center gap-4">
                            <TabsList>
                                <TabsTrigger value="overview">Candidates</TabsTrigger>
                                <TabsTrigger value="issues">Issues</TabsTrigger>
                            </TabsList>

                            <Dialog open={isOpen} onOpenChange={(open) => {
                                setIsOpen(open);
                                if (!open) resetForm();
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2"><Plus size={16} /> Add Candidate</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="p-6 pb-2">
                                        <DialogTitle>{editingId ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="flex-1 p-6 pt-2">
                                        <form id="candidate-form" onSubmit={handleSubmit} className="space-y-6">
                                            <Tabs defaultValue="overview" className="w-full">
                                                <TabsList className="grid w-full grid-cols-4">
                                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                                    <TabsTrigger value="promises">Promises</TabsTrigger>
                                                    <TabsTrigger value="funds">Funds</TabsTrigger>
                                                </TabsList>

                                                {/* OVERVIEW TAB */}
                                                <TabsContent value="overview" className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">ID (Unique)</label>
                                                            <Input
                                                                value={formData.id}
                                                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                                                disabled={!!editingId}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Name</label>
                                                            <Input
                                                                value={formData.name}
                                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Party</label>
                                                            <Input
                                                                value={formData.party}
                                                                onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Constituency</label>
                                                            <Input
                                                                value={formData.constituency}
                                                                onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Ward</label>
                                                            <Input
                                                                value={formData.ward}
                                                                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Image URL</label>
                                                            <Input
                                                                value={formData.image}
                                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Bio</label>
                                                        <Textarea
                                                            value={formData.bio}
                                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                            className="h-20"
                                                        />
                                                    </div>
                                                </TabsContent>

                                                {/* PERSONAL TAB */}
                                                <TabsContent value="personal" className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Age</label>
                                                            <Input
                                                                type="number"
                                                                value={formData.age}
                                                                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Education</label>
                                                            <Input
                                                                value={formData.education}
                                                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Criminal Cases</label>
                                                            <Input
                                                                type="number"
                                                                value={formData.criminalCases}
                                                                onChange={(e) => setFormData({ ...formData, criminalCases: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Attendance (%)</label>
                                                            <Input
                                                                type="number"
                                                                value={formData.attendance}
                                                                onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Assets</label>
                                                        <Input
                                                            value={formData.assets}
                                                            onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                                                            placeholder="e.g. ₹5 Cr"
                                                        />
                                                    </div>
                                                </TabsContent>

                                                {/* PROMISES TAB */}
                                                <TabsContent value="promises" className="space-y-4 py-4">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-lg font-medium">Manifesto Promises</h3>
                                                        <Button type="button" size="sm" variant="outline" onClick={addPromise}>
                                                            <Plus size={14} className="mr-1" /> Add Promise
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {formData.promises.map((promise, index) => (
                                                            <div key={index} className="border p-4 rounded-lg bg-slate-50 relative">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                                    onClick={() => removePromise(index)}
                                                                >
                                                                    <Trash size={16} />
                                                                </Button>
                                                                <div className="grid gap-3">
                                                                    <div className="grid grid-cols-2 gap-2 pr-8">
                                                                        <Input
                                                                            placeholder="Promise Title"
                                                                            value={promise.title}
                                                                            onChange={(e) => {
                                                                                const newPromises = [...formData.promises];
                                                                                newPromises[index].title = e.target.value;
                                                                                setFormData({ ...formData, promises: newPromises });
                                                                            }}
                                                                        />
                                                                        <select
                                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            value={promise.status}
                                                                            onChange={(e) => {
                                                                                const newPromises = [...formData.promises];
                                                                                newPromises[index].status = e.target.value as any;
                                                                                setFormData({ ...formData, promises: newPromises });
                                                                            }}
                                                                        >
                                                                            <option value="not-started">Not Started</option>
                                                                            <option value="in-progress">In Progress</option>
                                                                            <option value="completed">Completed</option>
                                                                            <option value="broken">Broken</option>
                                                                        </select>
                                                                    </div>
                                                                    <Input
                                                                        placeholder="Category"
                                                                        value={promise.category}
                                                                        onChange={(e) => {
                                                                            const newPromises = [...formData.promises];
                                                                            newPromises[index].category = e.target.value;
                                                                            setFormData({ ...formData, promises: newPromises });
                                                                        }}
                                                                    />
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <Textarea
                                                                            placeholder="Description"
                                                                            value={promise.description}
                                                                            onChange={(e) => {
                                                                                const newPromises = [...formData.promises];
                                                                                newPromises[index].description = e.target.value;
                                                                                setFormData({ ...formData, promises: newPromises });
                                                                            }}
                                                                        />
                                                                        <div>
                                                                            <label className="text-xs">Completion %</label>
                                                                            <Input
                                                                                type="number"
                                                                                value={promise.completionPercentage}
                                                                                onChange={(e) => {
                                                                                    const newPromises = [...formData.promises];
                                                                                    newPromises[index].completionPercentage = Number(e.target.value);
                                                                                    setFormData({ ...formData, promises: newPromises });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>

                                                {/* FUNDS TAB */}
                                                <TabsContent value="funds" className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Allocated Funds (₹ Cr)</label>
                                                            <Input
                                                                type="number"
                                                                value={formData.funds.allocated}
                                                                onChange={(e) => setFormData({
                                                                    ...formData,
                                                                    funds: { ...formData.funds, allocated: Number(e.target.value) }
                                                                })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Utilized Funds (₹ Cr)</label>
                                                            <Input
                                                                type="number"
                                                                value={formData.funds.utilized}
                                                                onChange={(e) => setFormData({
                                                                    ...formData,
                                                                    funds: { ...formData.funds, utilized: Number(e.target.value) }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center mt-6">
                                                        <h3 className="text-lg font-medium">Projects</h3>
                                                        <Button type="button" size="sm" variant="outline" onClick={addProject}>
                                                            <Plus size={14} className="mr-1" /> Add Project
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {formData.funds.projects.map((project, index) => (
                                                            <div key={index} className="flex gap-2 items-center">
                                                                <Input
                                                                    placeholder="Project Name"
                                                                    className="flex-grow"
                                                                    value={project.name}
                                                                    onChange={(e) => {
                                                                        const newProjects = [...formData.funds.projects];
                                                                        newProjects[index].name = e.target.value;
                                                                        setFormData({ ...formData, funds: { ...formData.funds, projects: newProjects } });
                                                                    }}
                                                                />
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Cost"
                                                                    className="w-24"
                                                                    value={project.cost}
                                                                    onChange={(e) => {
                                                                        const newProjects = [...formData.funds.projects];
                                                                        newProjects[index].cost = Number(e.target.value);
                                                                        setFormData({ ...formData, funds: { ...formData.funds, projects: newProjects } });
                                                                    }}
                                                                />
                                                                <Input
                                                                    placeholder="Status"
                                                                    className="w-32"
                                                                    value={project.status}
                                                                    onChange={(e) => {
                                                                        const newProjects = [...formData.funds.projects];
                                                                        newProjects[index].status = e.target.value;
                                                                        setFormData({ ...formData, funds: { ...formData.funds, projects: newProjects } });
                                                                    }}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:bg-destructive/10"
                                                                    onClick={() => removeProject(index)}
                                                                >
                                                                    <Trash size={16} />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </form>
                                    </ScrollArea>
                                    <div className="p-6 border-t bg-background">
                                        <Button type="submit" form="candidate-form" className="w-full gap-2" disabled={createMutation.isPending || updateMutation.isPending}>
                                            <Save size={16} />
                                            {editingId ? "Update Candidate" : "Create Candidate"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <TabsContent value="overview">
                        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Party</TableHead>
                                        <TableHead>Constituency</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                        </TableRow>
                                    ) : sortedCandidates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">No candidates found</TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedCandidates.map((candidate: any) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell className="font-medium">{candidate.id}</TableCell>
                                                <TableCell>{candidate.name}</TableCell>
                                                <TableCell>{candidate.party}</TableCell>
                                                <TableCell>{candidate.constituency}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(candidate)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => {
                                                        if (confirm('Are you sure you want to delete this candidate?')) {
                                                            deleteMutation.mutate(candidate.id);
                                                        }
                                                    }}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="issues">
                        <div className="bg-card rounded-lg border shadow-sm">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold font-serif">Issue Moderation</h2>
                                <p className="text-muted-foreground">Verify citizen reports before they go public</p>
                            </div>
                            <div className="p-6">
                                <IssueModerationList />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}

function IssueModerationList() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: issues } = useQuery<any[]>({
        queryKey: ["/api/issues"],
    });

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/issues/${id}/verify`, { method: "PATCH" });
            if (!res.ok) {
                if (res.status === 401) throw new Error("Please log in to verify issues");
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || "Failed to verify");
                } catch {
                    throw new Error(text || "Failed to verify");
                }
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
            toast({ title: "Issue Verified", description: "The issue is now marked as verified." });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/issues/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
            toast({ title: "Issue Deleted", description: "The issue has been removed." });
        }
    });

    if (!issues?.length) return <div className="text-center py-12 text-muted-foreground">No reports found</div>;

    return (
        <div className="space-y-4">
            {issues.map((issue: any) => (
                <div key={issue._id} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 items-start">
                    <div className="w-full md:w-32 h-32 bg-muted rounded-md overflow-hidden shrink-0">
                        <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Issue Evidence" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{issue.title}</h3>
                            {issue.isVerified ? (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-600 text-white hover:bg-green-700">
                                    <CheckCircle size={12} className="mr-1" /> Verified
                                </div>
                            ) : (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    Pending
                                </div>
                            )}
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                {issue.status}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        <div className="text-xs text-muted-foreground pt-2">
                            Reported by <strong>{issue.userId?.username || 'User'}</strong> at {issue.location} on {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!issue.isVerified && (
                            <Button size="sm" onClick={() => verifyMutation.mutate(issue._id)} disabled={verifyMutation.isPending}>
                                Verify
                            </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => {
                            if (confirm('Are you sure you want to delete this report?')) deleteMutation.mutate(issue._id)
                        }}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
