import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Send, X, MessageSquare, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    }, [messages, isOpen]);

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
                        className="fixed bottom-24 right-6 z-50 w-[350px] shadow-2xl"
                    >
                        <Card className="border-primary/20 bg-background/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="h-5 w-5" />
                                    <div>
                                        <CardTitle className="text-base">JanSahayak AI</CardTitle>
                                        <p className="text-[10px] opacity-80">Powered by Gemini</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 h-[400px] flex flex-col">
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                                >
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-muted text-foreground rounded-tl-none border"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {chatMutation.isPending && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-secondary/5 border-t flex gap-2">
                                    <Input
                                        placeholder="Ask about wards..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="flex-1 bg-background"
                                        disabled={chatMutation.isPending}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={chatMutation.isPending || !inputValue.trim()}
                                        className="shrink-0"
                                    >
                                        {chatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center border-2 border-secondary hover:bg-primary/90 transition-colors"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </>
    );
}
