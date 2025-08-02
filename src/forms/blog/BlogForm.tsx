"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Quill from "quill";
import "quill/dist/quill.snow.css";


import { RootState } from "@/redux/store";
import { PostFormFields, setInitialData, updateField } from "@/redux/slice/blogSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePosts } from "@/hooks/usePost";
import { Loader2 } from "lucide-react";

interface BlogPostFormProps {
    mode: "create" | "edit";
    initialData?: Partial<PostFormFields>;
    initialId?: string
    //   onSubmit: (data: Partial<PostFormFields>) => void;
}

export default function BlogPostForm({ mode, initialData, initialId }: BlogPostFormProps) {
    const dispatch = useDispatch();
    const {
        create,
        update,
    } = usePosts()
    const { formData, originalData } = useSelector((state: RootState) => state.postForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const quillRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<Quill | null>(null);
    const initializedRef = useRef(false);


    useEffect(() => {
        if (quillRef.current && !editorRef.current && !initializedRef.current) {
            quillRef.current.innerHTML = ""; // clear duplicate toolbars

            const quill = new Quill(quillRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline"],
                        ["blockquote", "code-block"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });


            quill.root.innerHTML = formData.content || "";

            editorRef.current = quill;
            initializedRef.current = true;

            quill.on("text-change", () => {
                dispatch(updateField({ field: "content", value: quill.root.innerHTML }));
            });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.off("text-change");
                editorRef.current = null;
                initializedRef.current = false; // reset for future re-inits
            }
        };
    }, []);


    useEffect(() => {
        if (mode === "edit" && initialData) {
            dispatch(setInitialData(initialData));
        }
    }, [initialData, mode]);

    useEffect(() => {
        if (
            mode === "edit" &&
            editorRef.current &&
            formData.content !== editorRef.current.root.innerHTML
        ) {
            editorRef.current.root.innerHTML = formData.content || "";
        }
    }, [formData.content, mode]);

    const handleChange = (field: keyof PostFormFields, value: any) => {
        dispatch(updateField({ field, value }));
    };

    const validate = (): boolean => {
        const errs: typeof errors = {};
        if (!formData.title?.trim()) errs.title = "Title is required";
        if (!formData.content?.trim()) errs.content = "Content is required";
        if (!formData.category) errs.category = "Category is required";
        if (!formData.coverImage) errs.coverImage = "Cover Image is required";
        if (!formData.tags) errs.tags = "At least one tag is required";
        if (!formData.metaTitle?.trim()) errs.metaTitle = "Meta Title is required";
        if (!formData.metaDescription?.trim())
            errs.metaDescription = "Meta Description is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        const newTags = [...(formData.tags || []), tagInput.trim()];
        dispatch(updateField({ field: "tags", value: newTags }));
        setTagInput("");
    };

    const handleRemoveTag = (tag: string) => {
        const newTags = (formData.tags || []).filter((t) => t !== tag);
        dispatch(updateField({ field: "tags", value: newTags }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const changed: Partial<PostFormFields> = {};
        for (const key in formData) {
            const typedKey = key as keyof PostFormFields;
            const newValue = formData[typedKey];
            const oldValue = originalData[typedKey];

            // Check for changes in both string and string[] fields
            const isArray = Array.isArray(newValue) && Array.isArray(oldValue);
            const isChanged = isArray
                ? JSON.stringify(newValue) !== JSON.stringify(oldValue)
                : newValue !== oldValue;

            if (isChanged) {
                changed[typedKey] = newValue as any; // forcefully assign with caution
            }
        }
        setIsSubmitting(true);
        if (mode === "create") {
            const newPost = await create(changed);
            if (!newPost.message) {
                if (editorRef?.current) {
                    editorRef.current.root.innerHTML = ""
                }
            }
        }
        if (mode === "edit" && initialId) {
            const updatedPost = await update(initialId, changed);
        }
        setIsSubmitting(false);

    };


    return (
        <Card className="max-w-5xl my-2 mx-auto">
            <CardHeader>
                <CardTitle>{mode === "create" ? "Create" : "Update"} Post</CardTitle>
            </CardHeader>
            <CardContent>

                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Title */}
                    <div className="grid gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter title"
                            required
                            value={formData.title || ""}
                            onChange={(e) => handleChange("title", e.target.value)}
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? "title-error" : undefined}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600" role="alert" id="title-error">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    {/* Category Select */}
                    <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={formData.category || ""}
                            onChange={(e) => handleChange("category", e.target.value)}
                            aria-invalid={!!errors.category}
                            aria-describedby={errors.category ? "category-error" : undefined}
                            className={`w-full p-2 border rounded ${errors.category ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Select category</option>
                            <option value="tech">Tech</option>
                            <option value="travel">Travel</option>
                            <option value="lifestyle">Lifestyle</option>
                        </select>
                        {errors.category && (
                            <p className="text-sm text-red-600" role="alert" id="category-error">
                                {errors.category}
                            </p>
                        )}
                    </div>





                    {/* Cover Image URL */}
                    <div className="grid gap-3">
                        <Label htmlFor="coverImage">Cover Image URL</Label>
                        <Input
                            id="coverImage"
                            placeholder="https://example.com/image.jpg"
                            value={formData.coverImage || ""}
                            onChange={(e) => handleChange("coverImage", e.target.value)}
                            aria-invalid={!!errors.coverImage}
                            aria-describedby={errors.coverImage ? "coverImage-error" : undefined}
                        />
                        {errors.coverImage && (
                            <p className="text-sm text-red-600" role="alert" id="coverImage-error">
                                {errors.coverImage}
                            </p>
                        )}
                        {formData.coverImage && (
                            <img
                                src={formData.coverImage}
                                alt="Cover preview"
                                className="h-40 w-full object-cover rounded border"
                            />
                        )}
                    </div>



                    <div className="grid gap-3">
                        <Label htmlFor="tagInput">Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tagInput"
                                placeholder="Add a tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                aria-invalid={!!errors.tags}
                                aria-describedby={errors.tags ? "tags-error" : undefined}
                            />
                            <Button type="button" onClick={handleAddTag}>
                                Add
                            </Button>
                        </div>

                        {/* Tags display */}
                        {formData.tags && formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-muted px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 text-red-500"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {errors.tags && (
                            <p className="text-sm text-red-600" role="alert" id="tags-error">
                                {errors.tags}
                            </p>
                        )}
                    </div>

                    {/* Meta Title */}
                    <div className="grid gap-3">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                            id="metaTitle"
                            placeholder="SEO meta title"
                            value={formData.metaTitle || ""}
                            onChange={(e) => handleChange("metaTitle", e.target.value)}
                            aria-invalid={!!errors.metaTitle}
                            aria-describedby={errors.metaTitle ? "metaTitle-error" : undefined}
                        />
                        {errors.metaTitle && (
                            <p className="text-sm text-red-600" role="alert" id="metaTitle-error">
                                {errors.metaTitle}
                            </p>
                        )}
                    </div>

                    {/* Meta Description */}
                    <div className="grid gap-3">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <textarea
                            id="metaDescription"
                            placeholder="SEO meta description"
                            value={formData.metaDescription || ""}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleChange("metaDescription", e.target.value)}
                            aria-invalid={!!errors.metaDescription}
                            aria-describedby={errors.metaDescription ? "metaDescription-error" : undefined}
                        />
                        {errors.metaDescription && (
                            <p className="text-sm text-red-600" role="alert" id="metaDescription-error">
                                {errors.metaDescription}
                            </p>
                        )}
                    </div>


                    <div className="grid col-span-1 md:col-span-2">
                        <Label className="mb-2">Content</Label>
                        <div className="border p-2 rounded min-h-[200px]">
                            <div
                                ref={quillRef}
                                className="quill-editor"
                                style={{ height: "275px" }}
                            />
                        </div>
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>

                    <Button className="w-full mt-4" onClick={handleSubmit}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {mode === "edit" ? "Update Post" : "Create Post"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
