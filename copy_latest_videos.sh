#!/bin/bash

echo "🔍 Getting latest 3 videos from Ubuntu..."

# Get latest 3 folders (sorted by time)
FOLDERS=$(ssh ai-roboot@10.147.19.244 "cd ~/ai-robot-speaker-api/out && ls -t | head -3")

if [ -z "$FOLDERS" ]; then
    echo "❌ No folders found!"
    exit 1
fi

echo "📂 Found folders:"
echo "$FOLDERS"
echo ""

# Copy each video
i=1
for folder in $FOLDERS; do
    echo "📥 Copying video $i from folder: $folder"
    scp ai-roboot@10.147.19.244:~/ai-robot-speaker-api/out/$folder/robot_talk.mp4 ~/ai-robot-frontend/videos/demo$i.mp4
    
    if [ $? -eq 0 ]; then
        echo "✅ Video $i copied successfully"
    else
        echo "❌ Failed to copy video $i"
    fi
    
    i=$((i+1))
    echo ""
done

echo "📥 Copying robot face..."
scp ai-roboot@10.147.19.244:~/ai-robot-speaker-api/assets/robot_face.jpg ~/ai-robot-frontend/assets/

echo ""
echo "✅ All done!"
echo ""
echo "📊 Files in videos folder:"
ls -lh ~/ai-robot-frontend/videos/

echo ""
echo "📊 Files in assets folder:"
ls -lh ~/ai-robot-frontend/assets/
