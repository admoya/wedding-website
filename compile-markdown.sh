for i in blog-posts/*
do
    marked "${i}" -o "static/${i}"
done

for file in static/blog-posts/*
do
    mv $file `echo $file | sed 's/\(.*\.\)md/\1html/'`
done