#!/bin/bash

# إنشاء ملف .surgeignore
cat > dist/public/.surgeignore << 'EOF'
.git
.gitignore
node_modules
EOF

# النشر على Surge
cd dist/public

# استخدام surge token إذا كان متاحاً
surge . lahfa-menu.surge.sh --token "$SURGE_TOKEN" 2>&1

