CURRENT=0
for i in static/CouplePictures/*
do
    mv -- "$i" "static/CouplePictures/${CURRENT}.jpg"
    ((CURRENT+=1))
done