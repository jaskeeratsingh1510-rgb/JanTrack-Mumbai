import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { RobotAvatar } from "./robot-avatar";

interface Message {
    role: "user" | "bot";
    text: string;
}

export function JanSahayak() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Namaste! I am JanSahayak. Ask me about Mumbai wards, budgets, or candidates." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            const res = await apiRequest("POST", "/api/chat", { message });
            return res.json();
        },
        onSuccess: (data) => {
            setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        },
        onError: () => {
            setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I encountered an error. Please try again." }]);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, chatMutation.isPending]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setInputValue("");
        chatMutation.mutate(userMsg);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-28 right-6 z-50 w-[380px] shadow-2xl origin-bottom-right"
                    >
                        <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md overflow-hidden flex flex-col h-[500px]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-1 rounded-full">
                                        <RobotAvatar className="w-10 h-10" isThinking={chatMutation.isPending} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none">JanSahayak</h3>
                                        <p className="text-xs opacity-80 font-medium mt-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Online • AI Assistant
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary-foreground hover:bg-white/20 rounded-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-900/50">
                                <div
                                    ref={scrollRef}
                                    className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                                >
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={idx}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                                {msg.role === "bot" && (
                                                    <RobotAvatar className="w-6 h-6 mb-1 shrink-0" />
                                                )}
                                                <div
                                                    className={`px-4 py-2.5 text-sm shadow-sm ${msg.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none"
                                                        : "bg-white dark:bg-slate-800 text-foreground rounded-2xl rounded-bl-none border border-border/50"
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {chatMutation.isPending && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start"
                                        >
                                            <div className="flex items-end gap-2">
                                                <RobotAvatar className="w-6 h-6 mb-1 shrink-0" isThinking={true} />
                                                <div className="bg-white dark:bg-slate-800 border border-border/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                                    <div className="flex gap-1">
                                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-3 bg-background border-t shrink-0">
                                <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900 rounded-full px-1 border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <Input
                                        placeholder="Ask about candidates..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 h-10 px-4"
                                        disabled={chatMutation.isPending}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={chatMutation.isPending || !inputValue.trim()}
                                        className="rounded-full w-9 h-9 shrink-0 mr-1"
                                    >
                                        {chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-white dark:border-slate-800 hover:shadow-2xl transition-all overflow-hidden group"
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <RobotAvatar className="w-12 h-12 transform group-hover:scale-110 transition-transform" />
                    </div>
                )}
            </motion.button>
        </>
    );
}
