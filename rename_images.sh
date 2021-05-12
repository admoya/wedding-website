CURRENT=0
for i in static/CroppedCouplePictures/*
do
    mv -- "$i" "static/CroppedCouplePictures/${CURRENT}.jpg"
    ((CURRENT+=1))
done