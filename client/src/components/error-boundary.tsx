import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-6 text-center space-y-4">
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                            <AlertTriangle className="w-10 h-10 text-destructive" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                        <p className="text-muted-foreground text-sm">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="default"
                            className="w-full"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
