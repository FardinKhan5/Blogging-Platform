import React, { useEffect, useState } from 'react'; 
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';
import { getBlogpost, updateBlog, updateCover } from '../api/blogPost';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom'; 
import Loading from '../components/Loading';
import QuillResizeImage from 'quill-resize-image';
ReactQuill.Quill.register("modules/resize", QuillResizeImage)
const isQuillContentEmpty = (html) => {
    const strippedHtml = html.replace(/<p><br><\/p>|<p><\/p>|<p>&nbsp;<\/p>|\s/g, '');
    return strippedHtml.trim() === '';
};
const modules = {
    toolbar: {
        container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', "strike"],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['image', "link","code-block"],
            [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
        ]
    },
    resize: {
        locale: {},
    },
}

function EditPost() {
    const [loading, setLoading] = useState(false); 
    const { id } = useParams();
    const [blogData, setBlogData] = useState(null); 
    const navigate = useNavigate(); 

    const { register, control, handleSubmit, reset, formState: { errors, isDirty, isSubmitSuccessful } } = useForm({
        defaultValues: { 
            title: "",
            tags: "",
            content: ""
        }
    });

    useEffect(() => {
        if (!id) {
            toast.error("No blog ID provided.");
            navigate('/dashboard'); 
            return;
        }

        const fetchAndSetForm = async () => {
            try {
                const data = await getBlogpost(id);
                setBlogData(data); 

                reset({
                    title: data.title,
                    tags: data.tags ? data.tags.join(', ') : '', 
                    content: data.content,
                });

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load blog post.");
                navigate('/dashboard');
            }
        };

        fetchAndSetForm();
    }, [id, reset, navigate])

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({}, { keepValues: true, keepDirty: false, keepDefaultValues: false });
        }
    }, [isSubmitSuccessful, reset]);


    const onSubmit = async (data) => {
        if (isQuillContentEmpty(data.content)) {
            toast.error("Content is required.");
            return;
        }
        if (!blogData?.coverImage && (!data.coverImage || !data.coverImage[0])) {
             toast.error("Cover image is required.");
             return;
        }
        try {
            setLoading(true); 
            const formData = new FormData();
            formData.append("title", data.title);

            const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            tagsArray.forEach(tag => {
                formData.append("tags[]", tag); 
            });

            if (data.coverImage && data.coverImage[0]) {
                const coverData=new FormData()
                coverData.append("coverImage",data.coverImage[0])
                await updateCover(id,coverData)
            }
            formData.append("content", data.content);

            await updateBlog(id,formData); 
            toast.success("Post updated successfully");
            navigate('/dashboard'); 

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update post.");
        } finally {
            setLoading(false); 
        }
    };

    if (!blogData) return <Loading />;

    return (
        <div className='flex-1 h-full md:mx-52'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
                <div className='w-full pt-4 flex justify-end'>
                    <button type='submit' className='btn btn-primary relative top-0 left-0'
                        disabled={loading || !isDirty} 
                    >
                        {loading ? <span className='loading loading-spinner'></span> : "Update Post"}
                    </button>
                </div>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 my-2">
                    <legend className="fieldset-legend text-xl font-bold">Edit Post:</legend>
                    <label className="label">Title</label>
                    <input type="text" className="input w-full" placeholder="Title" {...register("title", { required: "Title is required", minLength: { value: 4, message: "Title must be 4 characters long" } })} />
                    {errors.title?.message && <p className="label text-red-600">{errors.title.message}</p>}
                    <label className="label">Tags</label>
                    <input type="text" className="input w-full" placeholder="tag1 ,tag2 ,..." {...register("tags", { required: "Atleast one tag is required" })} />
                    {errors.tags?.message && <p className="label text-red-600">{errors.tags.message}</p>}
                    <label className="label">Cover:</label>
                    {blogData && blogData.coverImage && (
                        <div className="mb-2 flex justify-center">
                            <img src={blogData.coverImage} alt="Current Cover" className="w-32 h-auto object-cover rounded-md" />
                        </div>
                    )}
                    <input type="file" className="file-input w-full"
                        {...register("coverImage", {
                            required: !blogData?.coverImage ? "Cover image is required" : false 
                        })}
                    />
                    {errors.coverImage?.message && <p className="label text-red-600">{errors.coverImage.message}</p>}
                    <label className="label">Content</label>
                    <Controller name='content' control={control}
                        rules={{ validate: (value) => !isQuillContentEmpty(value) || "Content is required" }}
                        render={({ field }) => (<ReactQuill theme='snow' value={field.value} onChange={(html) => field.onChange(html)} onBlur={(range, source, editor) => field.onBlur()} className='overflow-y-clip' modules={modules} />)} />
                    {errors.content?.message && <p className="label text-red-600">{errors.content.message}</p>}
                </fieldset>
            </form>
        </div>
    );
}

export default EditPost;