# namespace: czi_prosemirror_0_0_1_a
# version: 0.0.1
# name: czi-prosemirror
# subversion: a




echo "http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_a_index.html"
aws s3 cp bin/index.html s3://opt-static-resources/assets/czi_prosemirror_0_0_1_a_index.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;





echo "http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_a_ui.html"
aws s3 cp bin/ui.html s3://opt-static-resources/assets/czi_prosemirror_0_0_1_a_ui.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;





echo "http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_a_playground.html"
aws s3 cp bin/playground.html s3://opt-static-resources/assets/czi_prosemirror_0_0_1_a_playground.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;





echo "http://cdn.summitlearning.org/assets/czi_prosemirror_0_0_1_a_convert.html"
aws s3 cp bin/convert.html s3://opt-static-resources/assets/czi_prosemirror_0_0_1_a_convert.html --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;

