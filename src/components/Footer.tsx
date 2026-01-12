export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="opacity-80">
                    جميع الحقوق محفوظة &copy; {new Date().getFullYear()} شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد
                </p>
            </div>
        </footer>
    );
};
