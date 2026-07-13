#!/bin/bash

# تسجيل الدخول إلى Netlify
echo "جاري تسجيل الدخول إلى Netlify..."
netlify login --new

# النشر
echo "جاري نشر الموقع..."
netlify deploy --prod --dir=dist/public

echo "✅ تم النشر بنجاح!"
