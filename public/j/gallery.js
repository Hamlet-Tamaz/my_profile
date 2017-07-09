$(document).ready(function() {
	//			ARTIST

	// select artist
	$('.item').on('click', '.cl', function(e) {
		window.location = "/gallery/artists/" + e.delegateTarget.firstElementChild.innerHTML + '/art';
	});

	// edit artist
	$('#artists .glyphE').on('click', function(e) {
	e.preventDefault();

		$('div#form p.success').remove();

		
		var getEditUrl = e.currentTarget.dataset.getEditUrl;
		var makeEditUrl = e.currentTarget.dataset.makeEditUrl;
			
		$('div#form form#newArtist').css('display', 'none');
		$('div#form form#editArtist').css('display', 'inline-block');

		var artist = e.currentTarget.parentElement.parentElement.children,
				form = $('div#form form#editArtist')[0].children;


		form[2].children.id.value = artist[0].innerHTML;
		form[2].children.fname.value = artist[1].innerHTML;
		form[2].children.lname.value = artist[2].innerHTML;
		form[4].children.dob.value = artist[3].attributes.rel.value;
		form[4].children.email.value = artist[4].innerHTML;

		form[2].children.fname.focus();

		$('div#form form#editArtist input[type="submit"]').on('click', function(e) {
			e.preventDefault();

			$.ajax({
				method: 'PUT',
				url: makeEditUrl,
				data: {
					id: $('div#form form#editArtist')[0].children[2].children.id.value,
					fname: $('div#form form#editArtist')[0].children[2].children.fname.value,
					lname: $('div#form form#editArtist')[0].children[2].children.lname.value,
					dob: $('div#form form#editArtist')[0].children[4].children.dob.value,
					email: $('div#form form#editArtist')[0].children[4].children.email.value
				}
			}).then(function(res) {
				window.location = '/gallery/artists?flash=edits_saved';
			})
		});
	});

	//delete artist
	$('#artists .glyphD').on('click', function(e) {
		
		var deleteUrl = e.currentTarget.dataset.url;

		$.ajax({
			method: "DELETE",
			url: deleteUrl
		}).then(function(raw) {

			var item = e.currentTarget.parentElement.parentElement;

			item.innerHTML = 'Successfully deleted artist';
			item.style.color = '#F25F5C';
			item.style.margin = '0 auto';
			item.style.width = '22vw';

		});
	});

	//	toggle to newArtist form

	$('form#editArtist button').on('click', function(e) {
		$('div#form form#newArtist').css('display', 'inline-block');
		$('div#form form#editArtist').css('display', 'none');
	});

	

	//  	 ART

	// edit art
	$('#art .glyphE').on('click', function(e) {
		e.preventDefault();
		$('div#form p.success').remove();

		var getEditUrl = e.currentTarget.dataset.getEditUrl;
		var makeEditUrl = e.currentTarget.dataset.makeEditUrl;


		var tile = e.currentTarget.parentElement.parentElement.children,
				form = $('div#form form#editArt')[0].children;
		
		$('div#form form#newArt').css('display', 'none');
		$('div#form form#editArt').css('display', 'inline-block');

		form.id.value = tile[0].value;
		form.artist_id.value = tile[1].value;
		form[4].children.name.value = tile[2].innerText;
		form[4].children.price.value = +tile[5].innerText.substring(1, tile[5].innerHTML.length);
		form[4].children.desc.innerHTML = tile[4].innerText;

		form[4].children.name.focus();

		$('div#form form#editArt input[type="submit"]').on('click', function(e) {
			e.preventDefault();

			$.ajax({
				method: 'PUT',
				url: makeEditUrl,
				data: {
					id: form.id.value,
					artist_id: form.artist_id.value,
					name: form[4].children.name.value,
					price: form[4].children.price.value,
					desc: form[4].children.desc.value
				}
			}).then(function(res) {
				window.location = '/gallery/artists/'+form.artist_id.value+'/art?flash=edits_saved';
			})
		});
	});

	// submit edits
	$('div#form form#editArt input[type="submit"]').on('click', function(e) {
		e.preventDefault();

		window.location.search = '';
		var form = $('div#form form#editArt')[0].children;

		$.ajax({
			method: 'PUT',
			url: e.target.parentElement.dataset.action,
			data: {
				id: form.id.value,
				artist_id: form.artist_id.value,
				name: form[4].children.name.value,
				price: form[4].children.price.value,
				desc: form[4].children.desc.value
			}
		}).then(function(res) {
			window.location = '/gallery/artists/'+form.artist_id.value+'/art?flash=edits_saved';
		})
	});

	//delete art
	$('#art .glyphD').on('click', function(e) {
		
		var deleteUrl = e.currentTarget.dataset.url;
		$.ajax({
			method: "DELETE",
			url: deleteUrl
		}).then(function(raw) {

			var item = e.currentTarget.parentElement.parentElement;

			item.innerHTML = 'Successfully deleted art';
			item.style.color = '#F25F5C';
			item.style.border = 'none';
			item.style.height = 'auto';
			item.style.width = '100%';

		});
	});	

	//	toggle to newArt form

	$('form#editArt button').on('click', function(e) {
		e.preventDefault();
		$('div#form form#newArt').css('display', 'inline-block');
		$('div#form form#editArt').css('display', 'none');
	});



	//	ARTS

	// dynamic list update
	function deleteFromArts(e) {
		var deleteUrl = e.target.parentElement.dataset.url;
		$.ajax({
			method: "DELETE",
			url: deleteUrl
		}).then(function(raw) {

			var item = e.currentTarget.parentElement;

			item.innerHTML = 'Successfully deleted art';
			item.style.color = '#F25F5C';
			item.style.border = 'none';
			item.style.height = 'auto';
			item.style.width = '100%';

		});
	}

	$('div#arts select').on('change', function(e) {
		$.get('/gallery/art/' + e.target.value, function(artists) {

			$('div#artDisplay').empty();
			
			artists.forEach(function(el, i) {
				var tile = $('<div>', {'class': 'tile'});
				var bottom = $('<div>', {'class': 'bottom'});
				var del = $("<a class='glyphD' data-url='/artists/" + el.artist_id + "/art/" + el.art_id + "'><span class='fa fa-remove fa-2x'></span></a>").on('click', deleteFromArts);

				tile.append("<input type='hidden' value="+ el.art_id +">");
				tile.append("<input type='hidden' value="+ el.artist_id +">");
				tile.append("<h4 class='artist'>" + el.first_name + el.last_name +"</h4>");
				tile.append("<h4 class='name'><b>"+ el.name +"</b></h4>");
				tile.append("<img src='/i/iris_garden.jpg'>");
				tile.append("<p class='desc'>"+ el.description +"</p>");

				bottom.append("<a class='glyphE' href='/artists/"+ el.artist_id +"/art?artist_id="+ el.artist_id +"&art_id="+ el.art_id +"&name="+ el.name +"&price="+ el.price +"&desc="+ el.description +"&url=/artists/"+ el.artist_id +"/art/"+ el.art_id +"' data-get-edit-url='/artists/" + el.artist_id + "/art/" + el.id + "/edit' data-make-edit-url='/artists/" + el.artist_id + "/art/" + el.art_id + "'><span class='fa fa-edit fa-2x'></span></a>");
				bottom.append("<h3 class='price'>" + el.price + "</h3>");
				bottom.append(del);

				tile.append(bottom);

				$('div#artDisplay').append(tile);
			});
		});
	});

	
	// delete art from arts

	$('#arts .glyphD').on('click', function (e) {
		var deleteUrl = e.currentTarget.dataset.url;
		$.ajax({
			method: "DELETE",
			url: deleteUrl
		}).then(function(raw) {

			var item = e.currentTarget.parentElement.parentElement;

			item.innerHTML = 'Successfully deleted art';
			item.style.color = '#F25F5C';
			item.style.border = 'none';
			item.style.height = 'auto';
			item.style.width = '100%';

		});
	});	
});
