import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        party: "",
        constituency: "",
        ward: "",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        bio: "",
    });

    const { data: candidates, isLoading } = useQuery<any[]>({
        queryKey: ["/api/candidates"],
    });

    const createMutation = useMutation({
        mutationFn: async (newCandidate: any) => {
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
        mutationFn: async (candidate: any) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            party: "",
            constituency: "",
            ward: "",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
            bio: "",
        });
        setEditingId(null);
    };

    const handleEdit = (candidate: any) => {
        setFormData(candidate);
        setEditingId(candidate.id);
        setIsOpen(true);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-primary">Admin Dashboard</h1>
                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>Add Candidate</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">ID (Unique)</label>
                                        <Input
                                            value={formData.id}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                            disabled={!!editingId} // Cannot change ID when editing
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Party</label>
                                        <Input
                                            value={formData.party}
                                            onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Constituency</label>
                                        <Input
                                            value={formData.constituency}
                                            onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Ward</label>
                                    <Input
                                        value={formData.ward}
                                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Image URL</label>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Bio</label>
                                    <Input
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {editingId ? "Update Candidate" : "Create Candidate"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
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
                            ) : candidates?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No candidates found</TableCell>
                                </TableRow>
                            ) : (
                                candidates?.map((candidate: any) => (
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
            </div>
        </Layout>
    );
}
